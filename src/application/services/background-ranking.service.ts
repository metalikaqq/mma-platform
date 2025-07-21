import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Fight, FightResult, Fighter, Ranking } from '../../domain/entities';
import { IRankingRepository } from '../../domain/interfaces/ranking.repository.interface';
import { IFighterRepository } from '../../domain/interfaces/fighter.repository.interface';

@Injectable()
export class BackgroundRankingService {
  private readonly logger = new Logger(BackgroundRankingService.name);

  constructor(
    @Inject('IRankingRepository')
    private readonly rankingRepository: IRankingRepository,
    @Inject('IFighterRepository')
    private readonly fighterRepository: IFighterRepository,
  ) {}

  /**
   * Update rankings every hour
   * Points system:
   * - KO/Submission: 4 points
   * - Decision win: 3 points
   * - Draw: 1 point
   * - Loss: 0 points
   */
  @Cron(CronExpression.EVERY_HOUR)
  async updateRankings(): Promise<void> {
    this.logger.log('Starting background ranking update...');
    
    try {
      const weightClasses = await this.rankingRepository.getAllWeightClasses();
      
      for (const weightClass of weightClasses) {
        await this.recalculateRankingsForWeightClass(weightClass.id);
      }
      
      this.logger.log('Background ranking update completed successfully');
    } catch (error) {
      this.logger.error('Error updating rankings:', error);
    }
  }

  /**
   * Manual trigger for ranking updates after fights
   */
  async updateRankingsAfterFight(fight: Fight): Promise<void> {
    this.logger.log(`Updating rankings after fight: ${fight.id}`);
    
    try {
      const fighter1 = await this.fighterRepository.findById(fight.fighter1Id);
      const fighter2 = await this.fighterRepository.findById(fight.fighter2Id);

      if (!fighter1 || !fighter2) {
        this.logger.warn('Fighter not found for ranking update');
        return;
      }

      const points1 = this.calculatePoints(fight, fight.fighter1Id);
      const points2 = this.calculatePoints(fight, fight.fighter2Id);

      await this.updateFighterPoints(fighter1, points1);
      await this.updateFighterPoints(fighter2, points2);

      // Recalculate rankings for the weight class
      await this.recalculateRankingsForWeightClass(fighter1.weightClassId);
      
      this.logger.log('Rankings updated successfully after fight');
    } catch (error) {
      this.logger.error('Error updating rankings after fight:', error);
    }
  }

  private calculatePoints(fight: Fight, fighterId: string): number {
    const { result, winnerId } = fight;

    if (result === FightResult.DRAW) {
      return 1; // Draw: 1 point
    }

    if (winnerId === fighterId) {
      // Winner points
      switch (result) {
        case FightResult.KO:
        case FightResult.SUBMISSION:
          return 4; // KO/Submission: 4 points
        case FightResult.DECISION:
          return 3; // Decision: 3 points
        default:
          return 0;
      }
    }

    return 0; // Loss: 0 points
  }

  private async updateFighterPoints(fighter: Fighter, points: number): Promise<void> {
    let ranking = await this.rankingRepository.findByFighterAndWeightClass(
      fighter.id,
      fighter.weightClassId,
    );

    if (!ranking) {
      // Create new ranking record
      ranking = new Ranking();
      ranking.fighterId = fighter.id;
      ranking.weightClassId = fighter.weightClassId;
      ranking.points = points;
      ranking.wins = points > 0 ? 1 : 0;
      ranking.losses = points === 0 ? 1 : 0;
      ranking.draws = points === 1 ? 1 : 0;
      ranking.position = 0; // Will be calculated in recalculateRankings
    } else {
      // Update existing ranking
      ranking.points += points;
      
      if (points > 0) {
        ranking.wins += 1;
      } else if (points === 0) {
        ranking.losses += 1;
      } else if (points === 1) {
        ranking.draws += 1;
      }
    }

    await this.rankingRepository.save(ranking);
  }

  private async recalculateRankingsForWeightClass(weightClassId: string): Promise<void> {
    this.logger.log(`Recalculating rankings for weight class: ${weightClassId}`);
    
    // Get all rankings for the weight class, ordered by points (descending)
    const rankings = await this.rankingRepository.findByWeightClassOrderedByPoints(weightClassId);
    
    // Update positions
    for (let i = 0; i < rankings.length; i++) {
      rankings[i].position = i + 1;
      await this.rankingRepository.save(rankings[i]);
    }
    
    this.logger.log(`Updated ${rankings.length} rankings for weight class: ${weightClassId}`);
  }

  /**
   * Get current rankings for a weight class
   */
  async getRankingsByWeightClass(weightClassId: string): Promise<Ranking[]> {
    return this.rankingRepository.findByWeightClass(weightClassId);
  }

  /**
   * Get fighter's current ranking
   */
  async getFighterRanking(fighterId: string, weightClassId: string): Promise<Ranking | null> {
    return this.rankingRepository.findByFighterAndWeightClass(fighterId, weightClassId);
  }

  /**
   * Manual recalculation of all rankings (useful for data fixes)
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async dailyRankingRecalculation(): Promise<void> {
    this.logger.log('Starting daily ranking recalculation...');
    
    try {
      const weightClasses = await this.rankingRepository.getAllWeightClasses();
      
      for (const weightClass of weightClasses) {
        await this.recalculateRankingsForWeightClass(weightClass.id);
      }
      
      this.logger.log('Daily ranking recalculation completed');
    } catch (error) {
      this.logger.error('Error in daily ranking recalculation:', error);
    }
  }
}
