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

## Current demo behavior

The profile selector lets reviewers view the app as a sample student because authentication is not connected to the `students` table yet. When Supabase is available, profiles, skills, matches, requests, exchanges, sessions, reviews, and notifications are read from PostgreSQL; supported profile, skill, request, exchange, session, and notification actions write to those tables.
