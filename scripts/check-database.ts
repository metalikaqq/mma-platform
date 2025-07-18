import { DataSource } from 'typeorm';
import {
  WeightClass,
  Fighter,
  Event,
  Fight,
  Ranking,
} from '../src/domain/entities';

async function checkDatabase() {
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

    // Перевіряємо які таблиці існують
    console.log('📋 Checking existing tables...');
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('Existing tables:');
    tables.forEach((table: any) => {
      console.log(`  - ${table.table_name}`);
    });

    // Перевіряємо метадані сутностей
    console.log('\n📊 Entity metadata:');
    dataSource.entityMetadatas.forEach(metadata => {
      console.log(`  - Entity: ${metadata.name}, Table: ${metadata.tableName}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed.');
    }
  }
}

checkDatabase();
