import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { WeightClassSchema } from './weight-class.schema';

@ObjectType('Fighter')
export class FighterSchema {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  birth_date?: string;

  @Field(() => Int)
  wins: number;

  @Field(() => Int)
  losses: number;

  @Field(() => Int)
  draws: number;

  @Field(() => Int)
  knockouts: number;

  @Field(() => Int)
  submissions: number;

  @Field(() => Int)
  weightClassId: number;

  @Field(() => WeightClassSchema, { nullable: true })
  weightClass?: WeightClassSchema;
}
