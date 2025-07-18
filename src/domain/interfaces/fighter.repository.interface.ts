import { Fighter } from '../entities';
import { IRepository } from './repository.interface';

export interface IFighterRepository extends IRepository<Fighter> {
  findByWeightClass(weightClassId: string): Promise<Fighter[]>;
  findWithStats(id: string): Promise<Fighter | null>;
  updateStats(
    id: string,
    stats: Partial<
      Pick<Fighter, 'wins' | 'losses' | 'draws' | 'knockouts' | 'submissions'>
    >,
  ): Promise<Fighter>;
}
