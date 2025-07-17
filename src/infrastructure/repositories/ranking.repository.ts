import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking } from '../../domain/entities';
import { IRankingRepository } from '../../domain/interfaces/ranking.repository.interface';

@Injectable()
export class RankingRepository implements IRankingRepository {
  constructor(
    @InjectRepository(Ranking)
    private readonly repository: Repository<Ranking>,
  ) {}

  async findAll(): Promise<Ranking[]> {
    return this.repository.find({
      relations: ['fighter', 'weightClass'],
      order: { rankPosition: 'ASC' },
    });
  }

  async findById(id: number): Promise<Ranking | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['fighter', 'weightClass'],
    });
  }

  async findByWeightClass(weightClassId: number): Promise<Ranking[]> {
    return this.repository.find({
      where: { weightClassId },
      relations: ['fighter', 'weightClass'],
      order: { rankPosition: 'ASC' },
    });
  }

  async findByFighter(fighterId: number): Promise<Ranking[]> {
    return this.repository.find({
      where: { fighterId },
      relations: ['fighter', 'weightClass'],
    });
  }

  async create(entity: Partial<Ranking>): Promise<Ranking> {
    const ranking = this.repository.create(entity);
    return this.repository.save(ranking);
  }

  async update(id: number, entity: Partial<Ranking>): Promise<Ranking> {
    await this.repository.update(id, entity);
    return this.findById(id) as Promise<Ranking>;
  }

  async updateRankings(
    weightClassId: number,
    rankings: Partial<Ranking>[],
  ): Promise<void> {
    for (const ranking of rankings) {
      if (ranking.id) {
        await this.repository.update(ranking.id, ranking);
      }
    }
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
