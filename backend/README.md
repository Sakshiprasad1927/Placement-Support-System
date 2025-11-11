# IGDTUW Placement Support System — Backend (scaffold)

This is a minimal backend scaffold implementing core features described in the requirements:
- JWT auth (role-based)
- Student, Company, Admin routes
- Resume upload handling (multer, local disk)
- Basic analytics endpoints for admin

Not a full product — but a strong starting point for the MERN stack app.

## Quick setup

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies and run:

```powershell
cd "D:\my folders\sem 7\placement_support_system\backend"
npm install
npm run dev   # requires nodemon; or npm start
```

3. Server default: http://localhost:4000

## Important endpoints (examples)

- POST /api/auth/register  { email, password, role }
- GET /api/auth/verify-email?token=...  (email link)
- POST /api/auth/login -> { token }

Student (use Authorization: Bearer <token>):
- GET /api/students/me
- PUT /api/students/me
- POST /api/students/upload-resume (form-data `resume`)
- GET /api/students/eligible-jobs
- POST /api/students/apply/:jobId

Company:
- POST /api/companies/jobs  (create job)
- GET /api/companies/jobs/my
- GET /api/companies/jobs/:jobId/applications
- POST /api/companies/applications/:id/status { status }

Admin:
- GET /api/admin/students
- POST /api/admin/companies/:id/verify
- GET /api/admin/profile-edit-requests
- POST /api/admin/profile-edit-requests/:id/approve
- GET /api/admin/analytics

## Notes & next steps
- Frontend (React + Tailwind) is not included yet — you can use these APIs as backend.
- Resume files are stored in `uploads/` and accessible via `/uploads/<filename>`; restrict in production.
- Email sending falls back to console when SMTP env vars not set.
- Security improvements for production: HTTPS, stronger JWT key, rate-limiting, input sanitization, file virus scanning, storing resumes in GridFS/S3, RBAC/permissions audits, logging.

If you'd like, I can now:
- Add a React + Tailwind starter that talks to this API (scaffold client)
- Replace disk storage with GridFS or S3 for resumes
- Add tests or CI config
- Harden authentication flows (refresh tokens, password reset)

Tell me which next step you want and I'll implement it.
