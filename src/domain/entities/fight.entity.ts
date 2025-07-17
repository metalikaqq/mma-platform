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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'event_id' })
  eventId: number;

  @Column({ name: 'fighter1_id' })
  fighter1Id: number;

  @Column({ name: 'fighter2_id' })
  fighter2Id: number;

  @Column({ type: 'enum', enum: FightResult })
  result: FightResult;

  @Column({ name: 'winner_id', nullable: true })
  winnerId: number;

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
