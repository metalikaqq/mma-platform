import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { WeightClass } from './weight-class.entity';
import { Fight } from './fight.entity';
import { Ranking } from './ranking.entity';

@Entity('fighters')
export class Fighter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @Column({ type: 'int', default: 0 })
  wins: number;

  @Column({ type: 'int', default: 0 })
  losses: number;

  @Column({ type: 'int', default: 0 })
  draws: number;

  @Column({ type: 'int', default: 0 })
  knockouts: number;

  @Column({ type: 'int', default: 0 })
  submissions: number;

  @Column({ name: 'weight_class_id', type: 'uuid' })
  weightClassId: string;

  @ManyToOne(() => WeightClass, (weightClass) => weightClass.fighters)
  @JoinColumn({ name: 'weight_class_id' })
  weightClass: WeightClass;

  @OneToMany(() => Fight, (fight) => fight.fighter1)
  fightsAsFighter1: Fight[];

  @OneToMany(() => Fight, (fight) => fight.fighter2)
  fightsAsFighter2: Fight[];

  @OneToMany(() => Fight, (fight) => fight.winner)
  wins_fights: Fight[];

  @OneToMany(() => Ranking, (ranking) => ranking.fighter)
  rankings: Ranking[];
}
