# Інструкції для ручного тестування

## Крок 1: Підготовка бази даних

1. Відкрийте pgAdmin або підключіться до PostgreSQL
2. Виконайте цей SQL запит для створення вагових категорій:

```sql
INSERT INTO weight_classes (name) VALUES
    ('Flyweight'),
    ('Bantamweight'),
    ('Featherweight'),
    ('Lightweight'),
    ('Welterweight'),
    ('Middleweight'),
    ('Light Heavyweight'),
    ('Heavyweight');
```

## Крок 2: Запуск сервера

У терміналі виконайте:

```bash
npm run start:dev
```

## Крок 3: Відкриття тестового інтерфейсу

### Варіант 1: HTML тест

1. Відкрийте файл `test-graphql.html` у браузері
2. Подвійний клік по файлу або перетягніть у браузер

### Варіант 2: GraphQL Playground

1. Відкрийте браузер
2. Перейдіть на `http://localhost:3000/graphql`

## Крок 4: Тестування

### Тест 1: Схема

```graphql
query {
  __schema {
    types {
      name
    }
  }
}
```

### Тест 2: Створення бійця

```graphql
mutation {
  createFighter(
    input: {
      name: "Conor McGregor"
      birth_date: "1988-07-14"
      weightClassId: 1
    }
  ) {
    id
    name
    wins
    losses
    draws
  }
}
```

### Тест 3: Отримання бійців

```graphql
query {
  fighters {
    id
    name
    wins
    losses
    draws
  }
}
```

### Тест 4: Створення події

```graphql
mutation {
  createEvent(
    input: {
      name: "UFC 300"
      location: "Las Vegas, Nevada"
      event_date: "2024-04-13"
    }
  ) {
    id
    name
    location
    event_date
  }
}
```

### Тест 5: Рейтинги

```graphql
query {
  rankingsByWeightClass(weightClassId: 1) {
    id
    rankPosition
    points
    fighter {
      name
    }
  }
}
```

## Очікувані результати

✅ Всі запити повинні виконуватися без помилок
✅ Створення бійця повинно працювати після додавання вагових категорій
✅ Рейтинги можуть бути порожніми спочатку
✅ GraphQL Playground повинен показувати всі доступні типи та операції

## Вирішення проблем

- **Помилка зовнішнього ключа**: Переконайтеся, що створили вагові категорії в базі даних
- **Сервер не відповідає**: Перевірте, чи запущено `npm run start:dev`
- **База даних не підключається**: Перевірте налаштування в `src/infrastructure/config/database.config.ts`
