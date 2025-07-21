import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Fighter } from './fighter.entity';
import { WeightClass } from './weight-class.entity';

@Entity('rankings')
export class Ranking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fighter_id', type: 'uuid' })
  fighterId: string;

  @Column({ name: 'weight_class_id', type: 'uuid' })
  weightClassId: string;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ name: 'rank_position', type: 'int' })
  rankPosition: number;

  @Column({ type: 'int', default: 0 })
  wins: number;

  @Column({ type: 'int', default: 0 })
  losses: number;

  @Column({ type: 'int', default: 0 })
  draws: number;

  @Column({ type: 'int', default: 0 })
  position: number;

  @ManyToOne(() => Fighter, (fighter) => fighter.rankings)
  @JoinColumn({ name: 'fighter_id' })
  fighter: Fighter;

  @ManyToOne(() => WeightClass, (weightClass) => weightClass.rankings)
  @JoinColumn({ name: 'weight_class_id' })
  weightClass: WeightClass;
}
