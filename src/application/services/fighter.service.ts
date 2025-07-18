import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Fighter } from '../../domain/entities';
import { IFighterRepository } from '../../domain/interfaces/fighter.repository.interface';
import { CreateFighterDto } from '../dtos/create-fighter.dto';
import { UpdateFighterDto } from '../dtos/update-fighter.dto';

@Injectable()
export class FighterService {
  constructor(
    @Inject('IFighterRepository')
    private readonly fighterRepository: IFighterRepository,
  ) {}

  async findAll(): Promise<Fighter[]> {
    return this.fighterRepository.findAll();
  }

  async findById(id: string): Promise<Fighter> {
    const fighter = await this.fighterRepository.findById(id);
    if (!fighter) {
      throw new NotFoundException(`Fighter with ID ${id} not found`);
    }
    return fighter;
  }

  async findByWeightClass(weightClassId: string): Promise<Fighter[]> {
    return this.fighterRepository.findByWeightClass(weightClassId);
  }

  async create(createFighterDto: CreateFighterDto): Promise<Fighter> {
    const fighterData = {
      ...createFighterDto,
      birth_date: createFighterDto.birth_date
        ? new Date(createFighterDto.birth_date)
        : undefined,
    };
    return this.fighterRepository.create(fighterData);
  }

  async update(
    id: string,
    updateFighterDto: UpdateFighterDto,
  ): Promise<Fighter> {
    const fighter = await this.findById(id);
    const updateData = {
      ...updateFighterDto,
      birth_date: updateFighterDto.birth_date
        ? new Date(updateFighterDto.birth_date)
        : fighter.birth_date,
    };
    return this.fighterRepository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.fighterRepository.delete(id);
  }

  async updateFighterStats(
    fighterId: string,
    result: 'win' | 'loss' | 'draw',
    method?: 'KO' | 'SUBMISSION',
  ): Promise<void> {
    const fighter = await this.findById(fighterId);

    const updates: Partial<
      Pick<Fighter, 'wins' | 'losses' | 'draws' | 'knockouts' | 'submissions'>
    > = {};

    if (result === 'win') {
      updates.wins = fighter.wins + 1;
      if (method === 'KO') {
        updates.knockouts = fighter.knockouts + 1;
      } else if (method === 'SUBMISSION') {
        updates.submissions = fighter.submissions + 1;
      }
    } else if (result === 'loss') {
      updates.losses = fighter.losses + 1;
    } else if (result === 'draw') {
      updates.draws = fighter.draws + 1;
    }

    await this.fighterRepository.updateStats(fighterId, updates);
  }
}
