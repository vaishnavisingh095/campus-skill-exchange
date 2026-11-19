# Campus Skill Exchange frontend

React, TypeScript and Vite frontend for the Campus Skill Exchange database.

## Start locally

```powershell
cd frontend
npm install
npm run dev
```

The development server prints a local URL, usually `http://localhost:5173`.

## Supabase configuration

`frontend/.env.local` supplies `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. It is ignored by Git. If it is missing, create it using the project URL and anon/publishable key from Supabase settings. Never use a service-role key in a browser app.

For live data, run `database/01_schema.sql` and `database/02_seed_data.sql` in the Supabase SQL Editor first. If Supabase is unreachable, the app shows a read-only sample preview based on the synthetic workbook data.

## Authentication & demo fallback

Sign in with a verified `.edu` campus email via Supabase Auth (enforced by Row-Level Security policies in `database/01_schema.sql`). When `frontend/.env.local` is not configured, the profile selector lets reviewers explore the app in read-only demo mode.
