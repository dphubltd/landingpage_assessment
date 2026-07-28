const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const multer = require("multer");
const multerS3 = require("multer-s3");
const {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const { db, initDb } = require("./db");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendSubmissionEmail(formData, filesData) {
  const brand = formData.brandName || formData.customerName || "Submission";
  const fields = Object.entries(formData)
    .filter(
      ([, v]) =>
        v !== null &&
        v !== undefined &&
        v !== "" &&
        !(Array.isArray(v) && v.length === 0),
    )
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;border:1px solid #e2e8f0;font-size:13px;font-weight:600;background:#f8fafb;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 12px;border:1px solid #e2e8f0;font-size:13px">${Array.isArray(v) ? JSON.stringify(v) : String(v)}</td></tr>`,
    )
    .join("");

  const files = filesData
    .map((f) => `• ${f.originalName} (${(f.size / 1024).toFixed(1)} KB)`)
    .join("<br>");

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: `New Asset Collection Submission — ${brand}`,
    html: `
      <div style="max-width:600px;margin:0 auto;font-family:system-ui,sans-serif">
        <div style="background:#003a47;color:white;padding:20px;border-radius:12px 12px 0 0;text-align:center">
          <h2 style="margin:0;font-size:18px">New Submission: ${brand}</h2>
        </div>
        <div style="border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;padding:20px">
          <table style="width:100%;border-collapse:collapse">${fields}</table>
          ${files ? `<h4 style="margin:20px 0 8px;font-size:14px">📎 Attached Files</h4><div style="font-size:13px">${files}</div>` : ""}
        </div>
      </div>`,
  });
}

const app = express();
let PORT = Number(process.env.PORT) || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8000",
  "https://assetchecklistleadpathgroup.vercel.app/",
  "https://landingpage-assessment.vercel.app",
  "https://landingpage-assessment.onrender.com",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

const s3 = new S3Client({
  endpoint: process.env.WASABI_ENDPOINT,
  region: process.env.WASABI_REGION,
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY,
    secretAccessKey: process.env.WASABI_SECRET_KEY,
  },
  forcePathStyle: false,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.WASABI_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  }),
);

const requireAuth = (req, res, next) => {
  if (req.session && req.session.authenticated) return next();
  res.status(401).json({ error: "Unauthorized" });
};

app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    req.session.authenticated = true;
    return res.json({ success: true });
  }
  res.status(401).json({ error: "Invalid password" });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get("/api/check-auth", (req, res) => {
  res.json({ authenticated: !!req.session?.authenticated });
});

app.post("/api/submit", upload.array("files", 50), async (req, res) => {
  try {
    const formData = JSON.parse(req.body.formData || "{}");
    const endpoint = process.env.WASABI_ENDPOINT.replace(/\/+$/, "");
    const bucket = process.env.WASABI_BUCKET;
    const filesData = (req.files || []).map((f) => ({
      field: f.fieldname,
      originalName: f.originalname,
      filename: f.key,
      size: f.size,
      mimetype: f.mimetype,
      path: `${endpoint}/${bucket}/${f.key}`,
    }));

    const result = await db.execute({
      sql: "INSERT INTO submissions (form_data, files_data) VALUES (?, ?)",
      args: [JSON.stringify(formData), JSON.stringify(filesData)],
    });

    const id = Number(result.lastInsertRowid);

    sendSubmissionEmail(formData, filesData)
      .then(() => console.log(`Email sent for submission #${id}`))
      .catch((err) => console.error("Email send error:", err.message));

    res.json({ success: true, id });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ error: "Failed to save submission" });
  }
});

app.get("/api/submissions", requireAuth, async (req, res) => {
  try {
    const result = await db.execute(
      "SELECT id, created_at, form_data FROM submissions ORDER BY created_at DESC",
    );
    const rows = (result.rows || []).map((row) => {
      const fd = JSON.parse(row.form_data || "{}");
      return {
        id: row.id,
        created_at: row.created_at,
        brandName: fd.brandName || "",
        customerName: fd.customerName || "",
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

app.get("/api/submissions/:id", requireAuth, async (req, res) => {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM submissions WHERE id = ?",
      args: [req.params.id],
    });
    const rows = result.rows;
    if (!rows || rows.length === 0)
      return res.status(404).json({ error: "Not found" });
    const row = rows[0];
    res.json({
      id: row.id,
      form_data: JSON.parse(row.form_data || "{}"),
      files_data: JSON.parse(row.files_data || "[]"),
      created_at: row.created_at,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch submission" });
  }
});

app.get("/api/files/:filename", async (req, res) => {
  try {
    const cmd = new GetObjectCommand({
      Bucket: process.env.WASABI_BUCKET,
      Key: req.params.filename,
    });
    const data = await s3.send(cmd);
    const chunks = [];
    for await (const chunk of data.Body) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);
    res.set("Content-Type", data.ContentType || "application/octet-stream");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(buffer);
  } catch (err) {
    console.error("File proxy error:", err);
    res.status(404).json({ error: "File not found" });
  }
});

app.delete("/api/submissions/:id", requireAuth, async (req, res) => {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM submissions WHERE id = ?",
      args: [req.params.id],
    });
    const rows = result.rows;
    if (!rows || rows.length === 0)
      return res.status(404).json({ error: "Not found" });
    const row = rows[0];
    const files = JSON.parse(row.files_data || "[]");

    for (const f of files) {
      try {
        const key = path.basename(f.path);
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.WASABI_BUCKET,
            Key: key,
          }),
        );
      } catch (s3err) {
        console.error("S3 delete error for file:", f.filename, s3err);
      }
    }

    await db.execute({
      sql: "DELETE FROM submissions WHERE id = ?",
      args: [req.params.id],
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete submission" });
  }
});

let serverStarted = false;

const startServer = async (port) => {
  if (!serverStarted) {
    serverStarted = true;
    try {
      await initDb();
      console.log("Turso database initialized");
    } catch (err) {
      console.error("Failed to initialize database:", err);
      process.exit(1);
    }
  }

  const server = app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is busy, trying ${Number(port) + 1}...`);
      startServer(Number(port) + 1);
    } else {
      console.error("Server error:", err);
    }
  });
};
startServer(PORT);
