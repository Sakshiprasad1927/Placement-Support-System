# IGDTUW Placement — Frontend (Vite + React + Tailwind)

This is a minimal frontend scaffold that talks to the backend at http://localhost:4000 by default.

Setup:

```powershell
cd "D:\my folders\sem 7\placement_support_system\frontend"
npm install
# start dev server
npm run dev
```

Environment:
- You can set `VITE_API_BASE` in a `.env` file at the `frontend/` root to point to your backend, e.g. `VITE_API_BASE=http://localhost:4000`.

Notes:
- Login saves JWT in localStorage under `token` and `role` (student/company/admin). This is a simple approach for the scaffold; for production use a safer storage and refresh token pattern.
- Student dashboard includes resume upload and eligible jobs UI.
- Company and Admin flows are minimal but illustrate API usage.

Next steps I can implement:
- Improve UI/UX and add forms validations
- Implement application status pages and notifications
- Add unit/integration tests (Jest + React Testing Library)
- Connect to the actual backend and test full flows
