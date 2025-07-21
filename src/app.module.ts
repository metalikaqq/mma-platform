// Import polyfills first, before any other imports
import './polyfills';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { Repository } from 'typeorm';

import databaseConfig from './infrastructure/config/database.config';
import { WeightClass, Fighter, Event, Fight, Ranking } from './domain/entities';

import { FighterService } from './application/services/fighter.service';
import { EventService } from './application/services/event.service';
import { FightService } from './application/services/fight.service';
import { RankingService } from './application/services/ranking.service';
import { BackgroundRankingService } from './application/services/background-ranking.service';

import { FighterRepository } from './infrastructure/repositories/fighter.repository';
import { RankingRepository } from './infrastructure/repositories/ranking.repository';
import { GenericRepository } from './infrastructure/repositories/generic.repository';

import { FighterResolver } from './infrastructure/graphql/resolvers/fighter.resolver';
import { EventResolver } from './infrastructure/graphql/resolvers/event.resolver';
import { FightResolver } from './infrastructure/graphql/resolvers/fight.resolver';
import { RankingResolver } from './infrastructure/graphql/resolvers/ranking.resolver';
import { WeightClassResolver } from './infrastructure/graphql/resolvers/weight-class.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get('database')!,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([WeightClass, Fighter, Event, Fight, Ranking]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
      csrfPrevention: false,
      context: ({ req }) => ({ req }),
    }),
  ],
  providers: [
    FighterService,
    EventService,
    FightService,
    RankingService,
    BackgroundRankingService,
    {
      provide: 'IFighterRepository',
      useClass: FighterRepository,
    },
    {
      provide: 'IRankingRepository',
      useClass: RankingRepository,
    },
    {
      provide: 'IRepository<Event>',
      useFactory: (repository: Repository<Event>) =>
        new GenericRepository(repository),
      inject: [getRepositoryToken(Event)],
    },
    {
      provide: 'IRepository<Fight>',
      useFactory: (repository: Repository<Fight>) =>
        new GenericRepository(repository),
      inject: [getRepositoryToken(Fight)],
    },
    FighterResolver,
    EventResolver,
    FightResolver,
    RankingResolver,
    WeightClassResolver,
  ],
})
export class AppModule {}
