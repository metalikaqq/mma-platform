import { Ranking } from '../entities';
import { IRepository } from './repository.interface';

export interface IRankingRepository extends IRepository<Ranking> {
  findByWeightClass(weightClassId: string): Promise<Ranking[]>;
  findByFighter(fighterId: string): Promise<Ranking[]>;
  updateRankings(
    weightClassId: string,
    rankings: Partial<Ranking>[],
  ): Promise<void>;
}
