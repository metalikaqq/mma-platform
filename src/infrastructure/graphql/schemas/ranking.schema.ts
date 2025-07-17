import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { FighterSchema } from './fighter.schema';
import { WeightClassSchema } from './weight-class.schema';

@ObjectType('Ranking')
export class RankingSchema {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  fighterId: number;

  @Field(() => Int)
  weightClassId: number;

  @Field(() => Int)
  points: number;

  @Field(() => Int)
  rankPosition: number;

  @Field(() => FighterSchema, { nullable: true })
  fighter?: FighterSchema;

  @Field(() => WeightClassSchema, { nullable: true })
  weightClass?: WeightClassSchema;
}
