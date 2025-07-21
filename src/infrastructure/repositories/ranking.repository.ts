import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking, WeightClass } from '../../domain/entities';
import { IRankingRepository } from '../../domain/interfaces/ranking.repository.interface';

@Injectable()
export class RankingRepository implements IRankingRepository {
  constructor(
    @InjectRepository(Ranking)
    private readonly repository: Repository<Ranking>,
    @InjectRepository(WeightClass)
    private readonly weightClassRepository: Repository<WeightClass>,
  ) {}

  async findAll(): Promise<Ranking[]> {
    return this.repository.find({
      relations: ['fighter', 'weightClass'],
      order: { rankPosition: 'ASC' },
    });
  }

  async findById(id: string): Promise<Ranking | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['fighter', 'weightClass'],
    });
  }

  async findByWeightClass(weightClassId: string): Promise<Ranking[]> {
    return this.repository.find({
      where: { weightClassId },
      relations: ['fighter', 'weightClass'],
      order: { rankPosition: 'ASC' },
    });
  }

  async findByFighter(fighterId: string): Promise<Ranking[]> {
    return this.repository.find({
      where: { fighterId },
      relations: ['fighter', 'weightClass'],
    });
  }

  async findByFighterAndWeightClass(fighterId: string, weightClassId: string): Promise<Ranking | null> {
    return this.repository.findOne({
      where: { fighterId, weightClassId },
      relations: ['fighter', 'weightClass'],
    });
  }

  async findByWeightClassOrderedByPoints(weightClassId: string): Promise<Ranking[]> {
    return this.repository.find({
      where: { weightClassId },
      relations: ['fighter', 'weightClass'],
      order: { points: 'DESC', rankPosition: 'ASC' },
    });
  }

  async getAllWeightClasses(): Promise<WeightClass[]> {
    return this.weightClassRepository.find();
  }

  async save(ranking: Ranking): Promise<Ranking> {
    return this.repository.save(ranking);
  }

  async create(entity: Partial<Ranking>): Promise<Ranking> {
    const ranking = this.repository.create(entity);
    return this.repository.save(ranking);
  }

  async update(id: string, entity: Partial<Ranking>): Promise<Ranking> {
    await this.repository.update(id, entity);
    return this.findById(id) as Promise<Ranking>;
  }

  async updateRankings(
    weightClassId: string,
    rankings: Partial<Ranking>[],
  ): Promise<void> {
    for (const ranking of rankings) {
      if (ranking.id) {
        await this.repository.update(ranking.id, ranking);
      }
    }
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
