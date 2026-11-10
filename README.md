# Campus Skill Exchange Programme

## Problem statement

Students often have useful skills to teach but no simple way to find classmates who want to learn them, and vice versa.

## Proposed solution

Campus Skill Exchange records student profiles, skills offered and wanted, reciprocal matches, exchange requests, learning sessions, reviews and notifications in a relational PostgreSQL database.

## Main workflow

Students create profiles and list skills they can teach and want to learn. The database can find reciprocal matches. Students send and respond to requests, organize an exchange, schedule sessions, and leave reviews.

## Database tables

`students`, `skill_categories`, `skills`, `student_skills`, `wanted_skills`, `exchange_requests`, `skill_exchanges`, `sessions`, `reviews`, and `notifications`.

## Technology stack

- Supabase PostgreSQL (hosted database)
- SQL for schema, sample data and demonstrations
- React, TypeScript and Vite for the interactive interface
- Supabase JavaScript client for browser database access

## Current implementation status

The PostgreSQL schema, workbook-derived synthetic seed records, and demonstration queries are included. The React interface reads the student, skill, request, exchange, session, review, and notification tables, and includes database actions for profiles, skills, requests, and sessions. Authentication is not connected yet; reviewers select a sample student profile. If Supabase cannot be reached, the app presents a read-only sample preview. The synthetic workbook `Campus_Skill_Exchange_Synthetic_Data.xlsx` is retained as the project data reference. `database/schema.sql` was present but empty and has been preserved.

## Run SQL in Supabase

1. Open the existing Supabase project and select **SQL Editor**.
2. Open `database/01_schema.sql`, copy its contents into a new SQL Editor query, and run it.
3. On an empty set of these tables, run database/02_seed_data.sql after the schema. Its foreign-key values follow the workbook row order, so do not run it a second time or after unrelated rows have been added.
4. Use `database/03_queries.sql` for basic verification and demonstrations.

The SQL files contain no Supabase credentials. Run them through the project SQL Editor. The browser uses `frontend/.env.local` for the project URL and anon key; that file is ignored by Git. Never put a service-role key in a browser app.

## Open the review interface

Start the React app from the `frontend` directory:

```powershell
cd frontend
npm install
npm run dev
```

Vite prints the local preview URL, usually `http://localhost:5173`. See `frontend/README.md` for Supabase configuration and preview behavior.
