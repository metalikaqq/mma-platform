import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fight, FightResult } from '../../domain/entities';
import { IRepository } from '../../domain/interfaces/repository.interface';
import { CreateFightDto } from '../dtos/create-fight.dto';
import { FighterService } from './fighter.service';
import { RankingService } from './ranking.service';

@Injectable()
export class FightService {
  constructor(
    @Inject('IRepository<Fight>')
    private readonly fightRepository: IRepository<Fight>,
    @InjectRepository(Fight)
    private readonly fightTypeOrmRepository: Repository<Fight>,
    private readonly fighterService: FighterService,
    private readonly rankingService: RankingService,
  ) {}

  async findAll(): Promise<Fight[]> {
    return await this.fightTypeOrmRepository.find({
      relations: ['event', 'fighter1', 'fighter2', 'winner'],
    });
  }

  async findById(id: string): Promise<Fight> {
    const fight = await this.fightTypeOrmRepository.findOne({
      where: { id },
      relations: ['event', 'fighter1', 'fighter2', 'winner'],
    });
    if (!fight) {
      throw new NotFoundException(`Fight with ID ${id} not found`);
    }
    return fight;
  }

  async create(createFightDto: CreateFightDto): Promise<Fight> {
    const fight = await this.fightRepository.create(createFightDto);

    await this.updateFighterStats(fight);
    await this.rankingService.updateRankingsAfterFight(fight);

    return fight;
  }

  async update(
    id: string,
    updateFightDto: Partial<CreateFightDto>,
  ): Promise<Fight> {
    await this.findById(id);
    return this.fightRepository.update(id, updateFightDto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.fightRepository.delete(id);
  }

  private async updateFighterStats(fight: Fight): Promise<void> {
    const { fighter1Id, fighter2Id, result, winnerId } = fight;

    if (result === FightResult.DRAW) {
      await this.fighterService.updateFighterStats(fighter1Id, 'draw');
      await this.fighterService.updateFighterStats(fighter2Id, 'draw');
    } else if (winnerId) {
      const loserId = winnerId === fighter1Id ? fighter2Id : fighter1Id;
      const method =
        result === FightResult.KO
          ? 'KO'
          : result === FightResult.SUBMISSION
            ? 'SUBMISSION'
            : undefined;

      await this.fighterService.updateFighterStats(winnerId, 'win', method);
      await this.fighterService.updateFighterStats(loserId, 'loss');
    }
  }
}
