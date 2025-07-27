# ZeroPassDrive

**ZeroPassDrive** is a modern, passwordless file storage app built with secure, JWT-based authentication and file uploads via Vercel Blob. Each user gets 500MB of storage and can upload files after logging in via email magic link (powered by Resend).

---

## 🚀 Features

- 🔐 Passwordless login & signup (Resend + JWT)
- 🧾 Authenticated file uploads (Max 500MB per user)
- ☁️ Uploads handled via [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- 🗃 File metadata stored in PostgreSQL using Prisma + Neon
- 🧪 Fully typed API with error handling
- 📄 Clean codebase with modular structure (Next.js App Router)

---

## 🛠 Tech Stack

| Layer       | Tech                                       |
|-------------|--------------------------------------------|
| Frontend    | Next.js (App Router)                       |
| Styling     | None (Minimal UI, no Tailwind)             |
| Auth        | Resend (email magic link), JWT             |
| DB          | PostgreSQL via Neon + Prisma ORM           |
| Uploads     | Vercel Blob (`@vercel/blob`)               |
| API         | RESTful endpoints in `/api` directory      |
| Deployment  | Vercel (fully serverless-compatible)       |

---

## 📦 Folder Structure (Key Parts)
```
/src
└── app
├── api
│ └── auth # Email login/signup routes
│ └── files
│ ├── upload # File upload route
│ └── list # List files route (if implemented)
└── lib
└── auth.ts # JWT utilities
└── prisma.ts # Prisma client
```

---

## 🔐 Authentication Flow

1. User enters email
2. Resend sends a magic link
3. JWT is generated and returned on login
4. All protected routes expect a valid Bearer token in `Authorization` header

---

## 📂 File Upload Flow

- Authenticated user selects a file
- File is streamed to Vercel Blob
- On success:
  - A public Blob URL is returned
  - Metadata (name, size, path, userId) is saved in Neon via Prisma
- Total user upload is capped at 500MB

---

## 🧾 Environment Variables

```env
# Prisma + Neon
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-secret-key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token

# Resend
RESEND_API_KEY=your-resend-key
RESEND_FROM=you@yourdomain.com

```
## ✨ Credits

🔗 [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)

🔐 [Resend](https://resend.com/)

🧬 [Prisma](https://www.prisma.io/)

☁️ [Neon](https://neon.com/)

⚙️ [Next.js](https://nextjs.org/)

##  
Made with 🖥️ By Guneet Toppo
