import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Fighter } from './fighter.entity';

export enum FightResult {
  KO = 'KO',
  SUBMISSION = 'SUBMISSION',
  DECISION = 'DECISION',
  DRAW = 'DRAW',
}

@Entity('fights')
export class Fight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @Column({ name: 'fighter1_id', type: 'uuid' })
  fighter1Id: string;

  @Column({ name: 'fighter2_id', type: 'uuid' })
  fighter2Id: string;

  @Column({ type: 'enum', enum: FightResult })
  result: FightResult;

  @Column({ name: 'winner_id', type: 'uuid', nullable: true })
  winnerId: string;

  @ManyToOne(() => Event, (event) => event.fights)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => Fighter, (fighter) => fighter.fightsAsFighter1)
  @JoinColumn({ name: 'fighter1_id' })
  fighter1: Fighter;

  @ManyToOne(() => Fighter, (fighter) => fighter.fightsAsFighter2)
  @JoinColumn({ name: 'fighter2_id' })
  fighter2: Fighter;

  @ManyToOne(() => Fighter, (fighter) => fighter.wins_fights)
  @JoinColumn({ name: 'winner_id' })
  winner: Fighter;
}
