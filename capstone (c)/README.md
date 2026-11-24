# FINDIT

FINDIT is a campus-based Lost and Found Management System built with HTML, CSS, JavaScript and Supabase.

## Features

- User registration and login with Supabase Auth
- Lost and found item reporting
- Image upload to Supabase Storage
- Manual item search and filtering
- Rule-based potential match scoring
- Claim workflow for recovery requests
- Dashboard and admin overview

## Project structure

- `index.html` — homepage
- `pages/` — route pages for app features
- `css/` — styles
- `js/` — browser JavaScript logic
- `database/` — Supabase schema and policies

## Local setup

1. Copy `.env.example` to `.env` and add your Supabase project values.
2. Start a local web server from the project root:
   `python -m http.server 8000`
3. Open `http://localhost:8000` in a browser.

## Supabase setup

1. Create a Supabase project.
2. Run the SQL in `database/schema.sql`.
3. Run the SQL in `database/policies.sql`.
4. Create a public storage bucket called `item-photos`.
5. Update `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `STORAGE_BUCKET` in `js/config.js`.
6. Set `DEMO_MODE` to `false` after the project credentials and SQL setup are verified.

Do not commit service-role keys or database passwords. The browser application uses only the Supabase anonymous key and relies on row-level security policies.

## Notes

This project is designed as a beginner-friendly capstone, so the code is intentionally clear and modular. The matching system is rule-based and ready for future AI enhancements.
