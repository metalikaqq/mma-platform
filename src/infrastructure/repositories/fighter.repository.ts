import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fighter } from '../../domain/entities';
import { IFighterRepository } from '../../domain/interfaces/fighter.repository.interface';

@Injectable()
export class FighterRepository implements IFighterRepository {
  constructor(
    @InjectRepository(Fighter)
    private readonly repository: Repository<Fighter>,
  ) {}

  async findAll(): Promise<Fighter[]> {
    return this.repository.find({
      relations: ['weightClass'],
    });
  }

  async findById(id: number): Promise<Fighter | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['weightClass'],
    });
  }

  async findByWeightClass(weightClassId: number): Promise<Fighter[]> {
    return this.repository.find({
      where: { weightClassId },
      relations: ['weightClass'],
    });
  }

  async findWithStats(id: number): Promise<Fighter | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['weightClass', 'fightsAsFighter1', 'fightsAsFighter2'],
    });
  }

  async create(entity: Partial<Fighter>): Promise<Fighter> {
    const fighter = this.repository.create(entity);
    return this.repository.save(fighter);
  }

  async update(id: number, entity: Partial<Fighter>): Promise<Fighter> {
    await this.repository.update(id, entity);
    return this.findById(id) as Promise<Fighter>;
  }

  async updateStats(
    id: number,
    stats: Partial<
      Pick<Fighter, 'wins' | 'losses' | 'draws' | 'knockouts' | 'submissions'>
    >,
  ): Promise<Fighter> {
    await this.repository.update(id, stats);
    return this.findById(id) as Promise<Fighter>;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
