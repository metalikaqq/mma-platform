import { Ranking, WeightClass } from '../entities';
import { IRepository } from './repository.interface';

export interface IRankingRepository extends IRepository<Ranking> {
  findByWeightClass(weightClassId: string): Promise<Ranking[]>;
  findByFighter(fighterId: string): Promise<Ranking[]>;
  findByFighterAndWeightClass(fighterId: string, weightClassId: string): Promise<Ranking | null>;
  findByWeightClassOrderedByPoints(weightClassId: string): Promise<Ranking[]>;
  getAllWeightClasses(): Promise<WeightClass[]>;
  save(ranking: Ranking): Promise<Ranking>;
  updateRankings(
    weightClassId: string,
    rankings: Partial<Ranking>[],
  ): Promise<void>;
}
