import { Injectable, Inject } from '@nestjs/common';
import { Fight, FightResult, Fighter, Ranking } from '../../domain/entities';
import { IRankingRepository } from '../../domain/interfaces/ranking.repository.interface';
import { IFighterRepository } from '../../domain/interfaces/fighter.repository.interface';

@Injectable()
export class RankingService {
  constructor(
    @Inject('IRankingRepository')
    private readonly rankingRepository: IRankingRepository,
    @Inject('IFighterRepository')
    private readonly fighterRepository: IFighterRepository,
  ) {}

  async findByWeightClass(weightClassId: number): Promise<Ranking[]> {
    return this.rankingRepository.findByWeightClass(weightClassId);
  }

  async updateRankingsAfterFight(fight: Fight): Promise<void> {
    const fighter1 = await this.fighterRepository.findById(fight.fighter1Id);
    const fighter2 = await this.fighterRepository.findById(fight.fighter2Id);

    if (!fighter1 || !fighter2) return;

    const points1 = this.calculatePoints(fight, fight.fighter1Id);
    const points2 = this.calculatePoints(fight, fight.fighter2Id);

    await this.updateFighterPoints(fighter1, points1);
    await this.updateFighterPoints(fighter2, points2);

    await this.recalculateRankings(fighter1.weightClassId);
  }

  private calculatePoints(fight: Fight, fighterId: number): number {
    const { result, winnerId } = fight;

    if (result === FightResult.DRAW) {
      return 1;
    }

    if (winnerId === fighterId) {
      switch (result) {
        case FightResult.KO:
        case FightResult.SUBMISSION:
          return 4;
        case FightResult.DECISION:
          return 3;
        default:
          return 0;
      }
    }

    return 0;
  }

  private async updateFighterPoints(
    fighter: Fighter,
    points: number,
  ): Promise<void> {
    const existingRanking = await this.rankingRepository.findByFighter(
      fighter.id,
    );

    if (existingRanking.length > 0) {
      const ranking = existingRanking[0];
      await this.rankingRepository.update(ranking.id, {
        points: ranking.points + points,
      });
    } else {
      await this.rankingRepository.create({
        fighterId: fighter.id,
        weightClassId: fighter.weightClassId,
        points: points,
        rankPosition: 999,
      });
    }
  }

  private async recalculateRankings(weightClassId: number): Promise<void> {
    const rankings =
      await this.rankingRepository.findByWeightClass(weightClassId);

    const sortedRankings = rankings.sort((a, b) => {
      if (a.points !== b.points) {
        return b.points - a.points;
      }

      return this.compareByWinPercentageAndRecentFight(a.fighter, b.fighter);
    });

    const updatedRankings = sortedRankings.map((ranking, index) => ({
      id: ranking.id,
      rankPosition: index + 1,
    }));

    await this.rankingRepository.updateRankings(weightClassId, updatedRankings);
  }

  private compareByWinPercentageAndRecentFight(
    fighter1: Fighter,
    fighter2: Fighter,
  ): number {
    const totalFights1 = fighter1.wins + fighter1.losses + fighter1.draws;
    const totalFights2 = fighter2.wins + fighter2.losses + fighter2.draws;

    const winPercentage1 = totalFights1 > 0 ? fighter1.wins / totalFights1 : 0;
    const winPercentage2 = totalFights2 > 0 ? fighter2.wins / totalFights2 : 0;

    if (winPercentage1 !== winPercentage2) {
      return winPercentage2 - winPercentage1;
    }

    return 0;
  }
}
