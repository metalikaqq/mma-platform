import { Fighter } from '../entities';
import { IRepository } from './repository.interface';

export interface IFighterRepository extends IRepository<Fighter> {
  findByWeightClass(weightClassId: number): Promise<Fighter[]>;
  findWithStats(id: number): Promise<Fighter | null>;
  updateStats(
    id: number,
    stats: Partial<
      Pick<Fighter, 'wins' | 'losses' | 'draws' | 'knockouts' | 'submissions'>
    >,
  ): Promise<Fighter>;
}
