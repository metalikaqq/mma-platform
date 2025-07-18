import { createConnection, Connection } from 'typeorm';
import {
  WeightClass,
  Fighter,
  Event,
  Fight,
  Ranking,
} from '../src/domain/entities';

async function clearDatabase() {
  let connection: Connection | undefined;

  try {
    console.log('🔌 Connecting to database...');
    
    // Створюємо з'єднання з базою даних
    connection = await createConnection({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'admin',
      database: process.env.DATABASE_NAME || 'mma_platform',
      entities: [WeightClass, Fighter, Event, Fight, Ranking],
      synchronize: false,
      logging: true,
    });

    console.log('✅ Connected to database successfully!');
    console.log('🗑️  Starting database cleanup...');

    // Видаляємо всі дані в правильному порядку (враховуючи зовнішні ключі)
    
    // 1. Спочатку видаляємо залежні таблиці
    console.log('Clearing Rankings...');
    await connection.getRepository(Ranking).clear();
    
    console.log('Clearing Fights...');
    await connection.getRepository(Fight).clear();
    
    console.log('Clearing Fighters...');
    await connection.getRepository(Fighter).clear();
    
    console.log('Clearing Events...');
    await connection.getRepository(Event).clear();
    
    console.log('Clearing Weight Classes...');
    await connection.getRepository(WeightClass).clear();

    // Скидаємо послідовності (sequences) для автоінкрементних полів
    console.log('🔄 Resetting sequences...');
    
    const queryRunner = connection.createQueryRunner();
    
    try {
      // Отримуємо всі послідовності та скидаємо їх
      await queryRunner.query(`
        SELECT setval(pg_get_serial_sequence('weight_class', 'id'), 1, false);
        SELECT setval(pg_get_serial_sequence('fighter', 'id'), 1, false);
        SELECT setval(pg_get_serial_sequence('event', 'id'), 1, false);
        SELECT setval(pg_get_serial_sequence('fight', 'id'), 1, false);
        SELECT setval(pg_get_serial_sequence('ranking', 'id'), 1, false);
      `);
    } catch (error) {
      console.log('⚠️  Warning: Could not reset sequences:', error.message);
    } finally {
      await queryRunner.release();
    }

    console.log('✨ Database cleared successfully!');
    console.log('📊 All entities and data have been removed.');
    console.log('🔢 Auto-increment sequences have been reset.');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  } finally {
    if (connection && connection.isConnected) {
      await connection.close();
      console.log('🔌 Database connection closed.');
    }
  }
}

// Запускаємо скрипт
clearDatabase()
  .then(() => {
    console.log('🎉 Database cleanup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database cleanup failed:', error);
    process.exit(1);
  });
