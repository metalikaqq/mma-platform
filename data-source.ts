import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import {
  WeightClass,
  Fighter,
  Event,
  Fight,
  Ranking,
} from './src/domain/entities';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST') || 'localhost',
  port: configService.get('DATABASE_PORT') || 5432,
  username: configService.get('DATABASE_USERNAME') || 'postgres',
  password: configService.get('DATABASE_PASSWORD') || 'admin',
  database: configService.get('DATABASE_NAME') || 'mma_platform',
  entities: [WeightClass, Fighter, Event, Fight, Ranking],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: configService.get('NODE_ENV') === 'development',
});
