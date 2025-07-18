import { DataSource } from 'typeorm';
import {
  WeightClass,
  Fighter,
  Event,
  Fight,
  Ranking,
} from '../src/domain/entities';

async function clearDatabase() {
  const dataSource = new DataSource({
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

  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Connected to database successfully!');
    console.log('🗑️  Starting database cleanup...');

    // Відключаємо перевірку зовнішніх ключів
    console.log('🔓 Disabling foreign key checks...');
    await dataSource.query('SET session_replication_role = replica;');

    // Видаляємо всі дані використовуючи DELETE
    console.log('Clearing Rankings...');
    await dataSource.query('DELETE FROM rankings;');
    
    console.log('Clearing Fights...');
    await dataSource.query('DELETE FROM fights;');
    
    console.log('Clearing Fighters...');
    await dataSource.query('DELETE FROM fighters;');
    
    console.log('Clearing Events...');
    await dataSource.query('DELETE FROM events;');
    
    console.log('Clearing Weight Classes...');
    await dataSource.query('DELETE FROM weight_classes;');

    // Включаємо назад перевірку зовнішніх ключів
    console.log('🔒 Re-enabling foreign key checks...');
    await dataSource.query('SET session_replication_role = DEFAULT;');

    // Скидаємо послідовності
    console.log('🔄 Resetting sequences...');
    try {
      await dataSource.query(`
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'weight_classes_id_seq') THEN
            PERFORM setval('weight_classes_id_seq', 1, false);
          END IF;
          
          IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'fighters_id_seq') THEN
            PERFORM setval('fighters_id_seq', 1, false);
          END IF;
          
          IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'events_id_seq') THEN
            PERFORM setval('events_id_seq', 1, false);
          END IF;
          
          IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'fights_id_seq') THEN
            PERFORM setval('fights_id_seq', 1, false);
          END IF;
          
          IF EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'rankings_id_seq') THEN
            PERFORM setval('rankings_id_seq', 1, false);
          END IF;
        END $$;
      `);
    } catch (error) {
      console.log('⚠️  Warning: Could not reset sequences:', error instanceof Error ? error.message : String(error));
    }

    console.log('✨ Database cleared successfully!');
    console.log('📊 All entities and data have been removed.');
    console.log('🔢 Auto-increment sequences have been reset.');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
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
