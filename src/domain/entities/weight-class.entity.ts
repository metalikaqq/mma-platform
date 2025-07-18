import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Fighter } from './fighter.entity';
import { Ranking } from './ranking.entity';

@Entity('weight_classes')
export class WeightClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => Fighter, (fighter) => fighter.weightClass)
  fighters: Fighter[];

  @OneToMany(() => Ranking, (ranking) => ranking.weightClass)
  rankings: Ranking[];
}
