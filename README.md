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
npm install              # зависимости корня (concurrently)
npm run install:all      # обязательно: зависимости backend и frontend
npm run dev              # запустить backend + frontend
```

**Важно:** После переноса проекта или клонирования сначала выполните `npm run install:all`, чтобы установить зависимости в `backend/` и `frontend/`.

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

## Регистрация не работает?

Если при регистрации появляется ошибка `Cannot find module '../encodings'` или подобная:

1. **Остановите все процессы Node** (старый сервер может занимать порт 3000):
   ```bash
   pkill -f "node.*server"   # или закройте терминал с сервером
   ```

2. **Запустите проект заново** из корня:
   ```bash
   npm run dev
   ```

3. Либо запускайте backend **только из папки backend**:
   ```bash
   cd backend && npm start
   ```
