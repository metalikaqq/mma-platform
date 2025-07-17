import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FightService } from '../../../application/services/fight.service';
import { FightSchema } from '../schemas/fight.schema';
import { CreateFightInput } from '../inputs/create-fight.input';
import { UpdateFightInput } from '../inputs/update-fight.input';
import { Fight } from '../../../domain/entities/fight.entity';

@Resolver(() => FightSchema)
export class FightResolver {
  constructor(private readonly fightService: FightService) {}

  private transformFightForGraphQL(fight: Fight): FightSchema {
    return {
      ...fight,
      event: fight.event
        ? {
            ...fight.event,
            event_date:
              fight.event.event_date instanceof Date
                ? fight.event.event_date.toISOString().split('T')[0]
                : (fight.event.event_date ?? undefined),
            fights: undefined,
          }
        : undefined,
      fighter1: fight.fighter1
        ? {
            ...fight.fighter1,
            birth_date:
              fight.fighter1.birth_date instanceof Date
                ? fight.fighter1.birth_date.toISOString().split('T')[0]
                : (fight.fighter1.birth_date ?? undefined),
          }
        : undefined,
      fighter2: fight.fighter2
        ? {
            ...fight.fighter2,
            birth_date:
              fight.fighter2.birth_date instanceof Date
                ? fight.fighter2.birth_date.toISOString().split('T')[0]
                : (fight.fighter2.birth_date ?? undefined),
          }
        : undefined,
      winner: fight.winner
        ? {
            ...fight.winner,
            birth_date:
              fight.winner.birth_date instanceof Date
                ? fight.winner.birth_date.toISOString().split('T')[0]
                : (fight.winner.birth_date ?? undefined),
          }
        : undefined,
    };
  }

  @Query(() => [FightSchema])
  async fights(): Promise<FightSchema[]> {
    const fights = await this.fightService.findAll();
    return fights.map((fight) => this.transformFightForGraphQL(fight));
  }

  @Query(() => FightSchema)
  async fight(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<FightSchema> {
    const fight = await this.fightService.findById(id);
    return this.transformFightForGraphQL(fight);
  }

  @Mutation(() => FightSchema)
  async createFight(
    @Args('input') input: CreateFightInput,
  ): Promise<FightSchema> {
    const fight = await this.fightService.create(input);
    return this.transformFightForGraphQL(fight);
  }

  @Mutation(() => FightSchema)
  async updateFight(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateFightInput,
  ): Promise<FightSchema> {
    const fight = await this.fightService.update(id, input);
    return this.transformFightForGraphQL(fight);
  }

  @Mutation(() => Boolean)
  async deleteFight(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.fightService.delete(id);
    return true;
  }
}
