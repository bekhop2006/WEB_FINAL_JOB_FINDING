# JobFinder

Job Finding Platform — Backend API and Frontend.

## Project Structure

```
WEB_FINAL_JOB_FINDING/
├── backend/     # Node.js, Express, MongoDB API
├── frontend/    # React приложение (Vite)
└── README.md
```

## Быстрый старт

```bash
npm install           # зависимости корня
npm run install:all   # зависимости backend и frontend (первый раз)
npm run dev           # запустить backend + frontend
```

Запускает **backend** (порт 3000) и **frontend** (порт 8080) одновременно.

- Frontend: http://localhost:8080
- API: http://localhost:3000
- Swagger UI: http://localhost:3000/swagger/

## Отдельный запуск

**Только backend:**
```bash
cd backend
npm install && npm start
```

**Только frontend:**
```bash
cd frontend
npm install && npm run dev
```

См. [backend/README.md](backend/README.md) и [frontend/README.md](frontend/README.md).
