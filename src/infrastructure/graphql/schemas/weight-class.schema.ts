import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType('WeightClass')
export class WeightClassSchema {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;
}
