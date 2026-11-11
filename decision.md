# Campus Skill Exchange — Engineering Decisions

## 1. Supabase (PostgreSQL + Auth + Realtime) Over Custom Express Backend
- **Decision:** Use Supabase directly from the React client (`frontend/src/lib/supabase.ts`) backed by PostgreSQL Row-Level Security (RLS).
- **Rationale:** Eliminates boilerplate CRUD APIs while enforcing strict per-user authorization (`public.current_student_id()` mapped to `auth.uid()`) at the database layer.

## 2. Offline Demo Fallback (`demo-data.ts`)
- **Decision:** Fall back to a read-only `demoSnapshot` whenever `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are absent or unreachable.
- **Rationale:** Ensures reviewers and local developers can immediately explore the full UI without provisioning a live Supabase project first.

## 3. Credit-Based Reciprocity (`credits` on `students`)
- **Decision:** Track non-monetary skill credits (default `10`, `+2` awarded to mentors upon completing a session).
- **Rationale:** Encourages balanced teaching and learning across departments without introducing payments.

## 4. Client-Side Instant Filtering Over Extra Round-Trips
- **Decision:** Filter reciprocal matches in `useMemo` by category, proficiency level, availability, minimum credits, and skill tags.
- **Rationale:** Campus cohorts fit comfortably in memory, giving zero-latency interactive filtering while keeping SQL equivalents in `database/03_queries.sql`.

## 5. `oxlint` + `tsc -b` in GitHub Actions
- **Decision:** Run both `oxlint` and `tsc -b && vite build` on every push/PR to `main`.
- **Rationale:** Catches unused imports, type regressions, and bundle issues before Vercel or Netlify deploys.
