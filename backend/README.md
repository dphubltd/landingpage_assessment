# Backend — Express API

Express server with Turso (libSQL) database, Wasabi S3 file storage, and nodemailer email notifications.

## Setup

```bash
cp .env.example .env     # or use existing .env — fill in your credentials
npm install
```

## Run

```bash
npm start                # production
npm run dev              # development with --watch
```

Server starts on the port defined in `.env` (`PORT=8000`).

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/submit` | No | Submit form data + files |
| GET | `/api/submissions` | Yes | List all submissions |
| GET | `/api/submissions/:id` | Yes | Get single submission |
| DELETE | `/api/submissions/:id` | Yes | Delete a submission |
| GET | `/api/files/:filename` | No | Serve uploaded files (proxy) |
| POST | `/api/login` | No | Admin login |
| POST | `/api/logout` | Yes | Admin logout |
| GET | `/api/check-auth` | Yes | Check session status |

## Required Environment Variables

```
ADMIN_PASSWORD=
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
WASABI_ENDPOINT=
WASABI_BUCKET=
WASABI_ACCESS_KEY=
WASABI_SECRET_KEY=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
RECEIVER_EMAIL=
```

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: Turso (libSQL)
- **File Storage**: Wasabi S3 (via multer + multer-s3)
- **Email**: Nodemailer (Gmail SMTP)
