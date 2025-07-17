import { Ranking } from '../entities';
import { IRepository } from './repository.interface';

export interface IRankingRepository extends IRepository<Ranking> {
  findByWeightClass(weightClassId: number): Promise<Ranking[]>;
  findByFighter(fighterId: number): Promise<Ranking[]>;
  updateRankings(
    weightClassId: number,
    rankings: Partial<Ranking>[],
  ): Promise<void>;
}
