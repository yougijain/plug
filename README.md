# Plug — Campus Ticket Marketplace

Plug is a campus-only ticket marketplace for students to buy and sell event tickets safely. The web app is built with React, TypeScript, Tailwind, and Supabase; an Expo-based mobile app starter lives in `ticketplug-mobile/` and reuses the same types, store, and API layer.

## Highlights
- **Campus-gated auth**: .edu email sign-up, email verification, and protected routes.
- **Ticket flows**: Create listings, browse/search/filter, view details with seller reputation, and save/unsave.
- **Supabase backend**: Typed queries via `src/lib/api.ts` using the shared `Database` types in `src/types/database.ts`.
- **State & data**: Zustand for auth/session state and React Query for API caching.
- **Demo-friendly**: Falls back to demo data if Supabase env vars are missing so the UI is always explorable.
- **Mobile path**: Expo/React Native starter (`ticketplug-mobile/`) with navigation scaffold ready to wire into the shared logic.

## Current State
- Web app routes are protected; the login page is the entry. Home, Saved, Create Ticket, Ticket Detail, and Profile screens are built with mobile-first styling.
- Supabase API coverage includes campuses, users, events, tickets, saved tickets, and reports. Mark-sold/delete/update endpoints exist; edit/delete UI is still light.
- Demo data powers the experience without env vars; real backend flows need a Supabase project + storage bucket configured.
- React Testing Library unit tests and Playwright e2e specs exist; they need a configured backend to be meaningful.
- Mobile app currently shows a minimal screen plus navigation scaffolding; screens mirror the web pages but still need implementation.

## Next Steps (resume/public-ready)
- Wire Supabase end-to-end: set env vars, run migrations in `supabase/migrations/`, and verify auth + ticket CRUD + saved tickets against a real project.
- Add production polish: loading/error/empty states across all screens, image upload to Supabase Storage, and mark-sold/edit/delete flows in the UI.
- Strengthen trust & safety: ensure RLS policies are enabled, seed campuses, and add better form validation/error copy.
- Ship-proof documentation: screenshots or a short Loom, deployment notes (Vercel/Netlify), and a concise “What works today” section.
- Testing & quality: run the existing Jest/RTL and Playwright suites, add CI checks, and keep secrets out of commits.
- Mobile: connect the Expo app to the shared API/store, implement screens, and test on iOS/Android simulators.

## Getting Started (Web)
1) Install: `npm install`  
2) Env: create `.env` with  
```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Optional (server-side tooling only, never ship to client builds):
```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
3) Check DB connectivity: `npm run db:test`  
4) Start dev server: `npm start`

## Getting Started (Mobile)
1) `cd ticketplug-mobile`  
2) `npm install`  
3) Add matching Supabase env (e.g., via `app.config.js` or `app.json` extras)  
4) `npx expo start` (use iOS/Android simulator or Expo Go)

## Project Structure
- `src/` — React web app (pages, components, hooks, Zustand store, Supabase API, types)
- `ticketplug-mobile/` — Expo/React Native starter with navigation and shared logic ready to plug in
- `supabase/` — SQL migrations and schema
- `tests/` and `src/__tests__/` — Playwright e2e and Jest/RTL unit tests
- Docs: `MVP_FEATURES.md`, `PRODUCTION_READY_CHECKLIST.md`, `FIX_AND_PUBLISH_PLAN.md`, `MOBILE_FIRST_ARCHITECTURE.md`

## License
MIT License