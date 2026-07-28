require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { getDb, saveDb } = require('./db');

const app = express();
let PORT = process.env.PORT || 5000;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use('/uploads', express.static(uploadsDir));

const requireAuth = (req, res, next) => {
  if (req.session && req.session.authenticated) return next();
  res.status(401).json({ error: 'Unauthorized' });
};

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    req.session.authenticated = true;
    return res.json({ success: true });
  }
  res.status(401).json({ error: 'Invalid password' });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/check-auth', (req, res) => {
  res.json({ authenticated: !!req.session?.authenticated });
});

app.post('/api/submit', upload.array('files', 50), async (req, res) => {
  try {
    const formData = JSON.parse(req.body.formData || '{}');
    const filesData = (req.files || []).map(f => ({
      field: f.fieldname,
      originalName: f.originalname,
      filename: f.filename,
      size: f.size,
      mimetype: f.mimetype,
      path: `/uploads/${f.filename}`
    }));

    const db = await getDb();
    db.run('INSERT INTO submissions (form_data, files_data) VALUES (?, ?)', [
      JSON.stringify(formData), JSON.stringify(filesData)
    ]);
    saveDb();

    const result = db.exec('SELECT seq FROM sqlite_sequence WHERE name = "submissions"');
    const id = result[0]?.values[0][0] || 1;

    res.json({ success: true, id });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ error: 'Failed to save submission' });
  }
});

app.get('/api/submissions', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec('SELECT id, created_at FROM submissions ORDER BY created_at DESC');
    const rows = (result[0]?.values || []).map(row => ({
      id: row[0],
      created_at: row[1]
    }));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

app.get('/api/submissions/:id', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec('SELECT * FROM submissions WHERE id = ?', [req.params.id]);
    const rows = result[0]?.values;
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const row = rows[0];
    const colNames = result[0].columns;
    const idx = name => colNames.indexOf(name);
    res.json({
      id: row[idx('id')],
      form_data: JSON.parse(row[idx('form_data')] || '{}'),
      files_data: JSON.parse(row[idx('files_data')] || '[]'),
      created_at: row[idx('created_at')]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

app.delete('/api/submissions/:id', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec('SELECT * FROM submissions WHERE id = ?', [req.params.id]);
    const rows = result[0]?.values;
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const colNames = result[0].columns;
    const idx = name => colNames.indexOf(name);
    const files = JSON.parse(rows[0][idx('files_data')] || '[]');
    files.forEach(f => {
      const fp = path.join(uploadsDir, path.basename(f.path));
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    });
    db.run('DELETE FROM submissions WHERE id = ?', [req.params.id]);
    saveDb();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};
startServer(PORT);
