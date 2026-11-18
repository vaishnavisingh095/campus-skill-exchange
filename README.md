# 🎓 Campus Skill Exchange (`skillswap.`)

[![Frontend CI](https://github.com/vaishnavisingh095/campus-skill-exchange/actions/workflows/ci.yml/badge.svg)](https://github.com/vaishnavisingh095/campus-skill-exchange/actions/workflows/ci.yml)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20RLS%20%2B%20Realtime-3ECF8E?logo=supabase&logoColor=fff)](https://supabase.com/)

A peer-to-peer **campus learning and skill-exchange platform** where university students teach what they know, learn what they want, earn skill credits, schedule sessions, and rate completed exchanges—without any monetary transactions.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    Student[Student Browser] --> ReactUI[React 19 + TypeScript + Vite App]
    ReactUI -->|".edu Email Sign-In / Sign-Up"| SupaAuth[Supabase Auth]
    ReactUI -->|"Queries, Mutations & Realtime"| SupaDB[(Supabase PostgreSQL)]
    ReactUI -->|"Offline Preview Fallback"| DemoData[demo-data.ts]

    subgraph Security_and_Data [PostgreSQL + Row-Level Security]
        SupaAuth -->|"auth.uid() -> current_student_id()"| RLS[RLS Policies]
        RLS --> Profiles[students · credits · availability]
        RLS --> Catalog[skill_categories · skills · student_skills · wanted_skills]
        RLS --> Booking[exchange_requests -> skill_exchanges -> sessions -> reviews]
        RLS --> Alerts[notifications]
    end

    subgraph CI_CD [CI/CD Pipeline]
        GitHub[GitHub main] -->|"Push / PR"| Actions[GitHub Actions: oxlint + tsc + vite build]
        GitHub -->|"Auto-Deploy"| Hosting[Vercel / Netlify]
    end
```
