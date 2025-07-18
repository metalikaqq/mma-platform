import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { FighterSchema } from './fighter.schema';
import { WeightClassSchema } from './weight-class.schema';

@ObjectType('Ranking')
export class RankingSchema {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  fighterId: string;

  @Field(() => ID)
  weightClassId: string;

  @Field(() => Int)
  points: number;

  @Field(() => Int)
  rankPosition: number;

  @Field(() => FighterSchema, { nullable: true })
  fighter?: FighterSchema;

  @Field(() => WeightClassSchema, { nullable: true })
  weightClass?: WeightClassSchema;
}
