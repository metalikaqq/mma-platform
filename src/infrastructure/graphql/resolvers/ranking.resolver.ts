import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { RankingService } from '../../../application/services/ranking.service';
import { RankingSchema } from '../schemas/ranking.schema';
import { Ranking } from '../../../domain/entities/ranking.entity';

@Resolver(() => RankingSchema)
export class RankingResolver {
  constructor(private readonly rankingService: RankingService) {}

  private transformRankingForGraphQL(ranking: Ranking): RankingSchema {
    return {
      ...ranking,
      fighter: ranking.fighter
        ? {
            ...ranking.fighter,
            birth_date:
              ranking.fighter.birth_date instanceof Date
                ? ranking.fighter.birth_date.toISOString().split('T')[0]
                : (ranking.fighter.birth_date ?? undefined),
          }
        : undefined,
    };
  }

  @Query(() => [RankingSchema])
  async rankingsByWeightClass(
    @Args('weightClassId', { type: () => Int }) weightClassId: number,
  ): Promise<RankingSchema[]> {
    const rankings = await this.rankingService.findByWeightClass(weightClassId);
    return rankings.map((ranking) => this.transformRankingForGraphQL(ranking));
  }
}
