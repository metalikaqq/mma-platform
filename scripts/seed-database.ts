import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  WeightClass,
  Fighter,
  Event,
  Fight,
  Ranking,
  FightResult,
} from '../src/domain/entities';

async function seedDatabase() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'admin',
    database: process.env.DATABASE_NAME || 'mma_platform',
    entities: [WeightClass, Fighter, Event, Fight, Ranking],
    synchronize: true,
    logging: true,
  });

  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Connected to database successfully!');

    console.log('🌱 Starting database seeding...');

    // Створюємо вагові категорії
    console.log('Creating weight classes...');
    const flyweight = await dataSource.getRepository(WeightClass).save({
      id: uuidv4(),
      name: 'Flyweight',
    });
    
    const bantamweight = await dataSource.getRepository(WeightClass).save({
      id: uuidv4(),
      name: 'Bantamweight',
    });

    const featherweight = await dataSource.getRepository(WeightClass).save({
      id: uuidv4(),
      name: 'Featherweight',
    });

    const lightweight = await dataSource.getRepository(WeightClass).save({
      id: uuidv4(),
      name: 'Lightweight',
    });

    const welterweight = await dataSource.getRepository(WeightClass).save({
      id: uuidv4(),
      name: 'Welterweight',
    });

    const middleweight = await dataSource.getRepository(WeightClass).save({
      id: uuidv4(),
      name: 'Middleweight',
    });

    const heavyweight = await dataSource.getRepository(WeightClass).save({
      id: uuidv4(),
      name: 'Heavyweight',
    });

    // Створюємо бійців
    console.log('Creating fighters...');
    const fighter1 = await dataSource.getRepository(Fighter).save({
      id: uuidv4(),
      name: 'Conor McGregor',
      birth_date: new Date('1988-07-14'),
      wins: 22,
      losses: 6,
      draws: 0,
      knockouts: 19,
      submissions: 1,
      weightClassId: lightweight.id,
    });

    const fighter2 = await dataSource.getRepository(Fighter).save({
      id: uuidv4(),
      name: 'Khabib Nurmagomedov',
      birth_date: new Date('1988-09-20'),
      wins: 29,
      losses: 0,
      draws: 0,
      knockouts: 8,
      submissions: 11,
      weightClassId: lightweight.id,
    });

    const fighter3 = await dataSource.getRepository(Fighter).save({
      id: uuidv4(),
      name: 'Jon Jones',
      birth_date: new Date('1987-07-19'),
      wins: 26,
      losses: 1,
      draws: 0,
      knockouts: 10,
      submissions: 6,
      weightClassId: heavyweight.id,
    });

    const fighter4 = await dataSource.getRepository(Fighter).save({
      id: uuidv4(),
      name: 'Anderson Silva',
      birth_date: new Date('1975-04-14'),
      wins: 34,
      losses: 11,
      draws: 1,
      knockouts: 23,
      submissions: 5,
      weightClassId: middleweight.id,
    });

    // Створюємо події
    console.log('Creating events...');
    const event1 = await dataSource.getRepository(Event).save({
      id: uuidv4(),
      name: 'UFC 229: Khabib vs McGregor',
      location: 'Las Vegas, Nevada',
      event_date: new Date('2018-10-06'),
    });

    const event2 = await dataSource.getRepository(Event).save({
      id: uuidv4(),
      name: 'UFC 232: Jones vs Gustafsson 2',
      location: 'Los Angeles, California',
      event_date: new Date('2018-12-29'),
    });

    // Створюємо бої
    console.log('Creating fights...');
    const fight1 = await dataSource.getRepository(Fight).save({
      id: uuidv4(),
      eventId: event1.id,
      fighter1Id: fighter1.id,
      fighter2Id: fighter2.id,
      result: FightResult.SUBMISSION,
      winnerId: fighter2.id,
    });

    const fight2 = await dataSource.getRepository(Fight).save({
      id: uuidv4(),
      eventId: event2.id,
      fighter1Id: fighter3.id,
      fighter2Id: fighter4.id,
      result: FightResult.DECISION,
      winnerId: fighter3.id,
    });

    // Створюємо рейтинги
    console.log('Creating rankings...');
    await dataSource.getRepository(Ranking).save({
      id: uuidv4(),
      fighterId: fighter2.id,
      weightClassId: lightweight.id,
      points: 100,
      rankPosition: 1,
    });

    await dataSource.getRepository(Ranking).save({
      id: uuidv4(),
      fighterId: fighter1.id,
      weightClassId: lightweight.id,
      points: 85,
      rankPosition: 2,
    });

    await dataSource.getRepository(Ranking).save({
      id: uuidv4(),
      fighterId: fighter3.id,
      weightClassId: heavyweight.id,
      points: 95,
      rankPosition: 1,
    });

    await dataSource.getRepository(Ranking).save({
      id: uuidv4(),
      fighterId: fighter4.id,
      weightClassId: middleweight.id,
      points: 90,
      rankPosition: 1,
    });

    console.log('✨ Database seeding completed successfully!');
    console.log('📊 Sample data has been created:');
    console.log(`  - ${7} weight classes`);
    console.log(`  - ${4} fighters`);
    console.log(`  - ${2} events`);
    console.log(`  - ${2} fights`);
    console.log(`  - ${4} rankings`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed.');
    }
  }
}

// Запускаємо скрипт
seedDatabase()
  .then(() => {
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database seeding failed:', error);
    process.exit(1);
  });
