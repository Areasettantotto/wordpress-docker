# WordPress Docker + React Headless

This repository contains a development setup for a WordPress site running in Docker (MySQL + WordPress) and a React frontend (Vite + Tailwind) that uses the WordPress REST API (headless).

Main structure:
- `docker-compose.yml` — Docker environment for WordPress and database
- `react-headless-wp/` — React frontend (Vite + Tailwind) that consumes the WordPress REST API

Quick notes for local usage:

1. Start Docker services (from this folder):

```bash
docker compose up -d
```

2. Open the WordPress admin (usually `http://localhost:8000/wp-admin`) and make sure to:
- Settings -> Permalinks -> `Post name`

3. Start the React frontend (in the `react-headless-wp` folder):

```bash
cd react-headless-wp
npm install
npm run dev
```

4. The frontend uses the Vite proxy to forward `/wp-json` to WordPress (configured in `react-headless-wp/vite.config.js`). If you change the API endpoint, update `VITE_API_BASE_URL` in the frontend environment variables.

Contacts and suggestions
- If posts do not appear, check that posts in WordPress are published and that the REST API responds (`http://localhost:8000/wp-json/wp/v2/posts`).

This file is a brief introduction; for more details, check the `react-headless-wp/` folder.
