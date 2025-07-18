import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FighterService } from '../../../application/services/fighter.service';
import { FighterSchema } from '../schemas/fighter.schema';
import { CreateFighterInput } from '../inputs/create-fighter.input';
import { UpdateFighterInput } from '../inputs/update-fighter.input';
import { Fighter } from '../../../domain/entities/fighter.entity';

@Resolver(() => FighterSchema)
export class FighterResolver {
  constructor(private readonly fighterService: FighterService) {}

  private transformFighterForGraphQL(fighter: Fighter): FighterSchema {
    return {
      ...fighter,
      birth_date:
        fighter.birth_date instanceof Date
          ? fighter.birth_date.toISOString().split('T')[0]
          : (fighter.birth_date ?? undefined),
    };
  }

  @Query(() => [FighterSchema])
  async fighters(): Promise<FighterSchema[]> {
    const fighters = await this.fighterService.findAll();
    return fighters.map((fighter) => this.transformFighterForGraphQL(fighter));
  }

  @Query(() => FighterSchema)
  async fighter(
    @Args('id', { type: () => String }) id: string,
  ): Promise<FighterSchema> {
    const fighter = await this.fighterService.findById(id);
    return this.transformFighterForGraphQL(fighter);
  }

  @Query(() => [FighterSchema])
  async fightersByWeightClass(
    @Args('weightClassId', { type: () => String }) weightClassId: string,
  ): Promise<FighterSchema[]> {
    const fighters = await this.fighterService.findByWeightClass(weightClassId);
    return fighters.map((fighter) => this.transformFighterForGraphQL(fighter));
  }

  @Mutation(() => FighterSchema)
  async createFighter(
    @Args('input') input: CreateFighterInput,
  ): Promise<FighterSchema> {
    const fighter = await this.fighterService.create(input);
    return this.transformFighterForGraphQL(fighter);
  }

  @Mutation(() => FighterSchema)
  async updateFighter(
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: UpdateFighterInput,
  ): Promise<FighterSchema> {
    const fighter = await this.fighterService.update(id, input);
    return this.transformFighterForGraphQL(fighter);
  }

  @Mutation(() => Boolean)
  async deleteFighter(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    await this.fighterService.delete(id);
    return true;
  }
}
