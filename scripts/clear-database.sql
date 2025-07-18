-- SQL скрипт для очищення бази даних MMA Platform
-- Запускайте цей скрипт в psql або через pgAdmin

-- Початок транзакції
BEGIN;

-- Видаляємо всі дані в правильному порядку (враховуючи зовнішні ключі)
DELETE FROM rankings;
DELETE FROM fights;
DELETE FROM fighters;
DELETE FROM events;
DELETE FROM weight_classes;

-- Скидаємо послідовності автоінкрементних полів
ALTER SEQUENCE IF EXISTS weight_classes_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS fighters_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS events_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS fights_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS rankings_id_seq RESTART WITH 1;

-- Підтверджуємо транзакцію
COMMIT;

-- Виводимо повідомлення про успішне завершення
SELECT 'База даних очищена успішно! Всі дані видалені.' as result;
