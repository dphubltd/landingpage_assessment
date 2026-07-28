# Frontend — Next.js Form & Admin Dashboard

Landing page asset collection form with file uploads and admin dashboard for viewing submissions.

## Setup

```bash
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm install
```

## Run

```bash
npm run dev:frontend     # Next.js dev server on :3000
npm run build            # production build
npm start                # production server
```

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:8000   # Backend URL
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Asset collection form |
| `/admin` | Admin login |
| `/admin/dashboard` | Submission list + detail modal |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Fonts**: Outfit (headings), Inter (body)
- **PDF**: html2pdf.js (client-side download)
