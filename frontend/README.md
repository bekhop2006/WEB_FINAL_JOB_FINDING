# JobFinder Frontend

React приложение для JobFinder. Подключается к backend API.

## Технологии

- React 18
- React Router 6
- Vite

## Запуск

```bash
cd frontend
npm install
npm run dev
```

Приложение: http://localhost:8080

**Важно:** Backend должен быть запущен на http://localhost:3000 (API проксируется через Vite).

## Сборка

```bash
npm run build
```

## Функции

- **Гости:** просмотр вакансий, фильтрация
- **Соискатели:** регистрация, отклики на вакансии, мои отклики, профиль
- **Работодатели:** создание/редактирование вакансий, просмотр откликов, профиль

## Структура

```
src/
├── api/          # API клиент
├── components/   # Компоненты
├── context/      # Auth контекст
├── pages/        # Страницы
└── index.css     # Стили
```
