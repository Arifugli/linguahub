# LinguaHub — Language Learning Marketplace

Маркетплейс для онлайн-обучения языкам. Репетиторы, языковые школы, ученики — всё в одном месте.

## Технологии

- **Frontend:** React 18 + Vite + TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Auth, Database, Edge Functions)

## Быстрый старт

### 1. Клонировать репозиторий
```bash
git clone https://github.com/YOUR_USERNAME/linguahub.git
cd linguahub
```

### 2. Установить зависимости
```bash
npm install
```

### 3. Настроить переменные окружения
```bash
cp .env.example .env
```
Открой `.env` и вставь свои ключи из [Supabase Dashboard](https://supabase.com/dashboard) → твой проект → Settings → API.

### 4. Запустить локально
```bash
npm run dev
```
Открой [http://localhost:8080](http://localhost:8080)

### 5. Собрать для продакшена
```bash
npm run build
```

## Структура проекта

```
src/
├── components/
│   ├── auth/          # Форма входа/регистрации
│   ├── classroom/     # Онлайн-класс, доска, видео
│   ├── dashboard/     # Кабинеты ученика, репетитора, школы, админа
│   ├── home/          # Лендинг (Hero, Tutors, Features...)
│   ├── layout/        # Header, Footer
│   └── ui/            # shadcn компоненты
├── contexts/          # AuthContext
├── hooks/             # Кастомные хуки
├── integrations/      # Supabase клиент и типы
└── pages/             # Route-страницы
```

## Роли пользователей

| Роль | Описание |
|------|----------|
| `student` | Ученик — поиск репетиторов, бронирование, прогресс |
| `tutor` | Репетитор — расписание, ученики, доходы |
| `school` | Языковая школа — команда, курсы, аналитика |
| `admin` | Администратор платформы |

## Деплой

### Vercel (рекомендуется)
1. Импортируй репозиторий на [vercel.com](https://vercel.com)
2. В настройках добавь Environment Variables из `.env`
3. Deploy!

### Netlify
1. Импортируй репозиторий
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Добавь Environment Variables

## База данных

Миграции находятся в `supabase/migrations/`. Для запуска:
```bash
npx supabase db push
```
