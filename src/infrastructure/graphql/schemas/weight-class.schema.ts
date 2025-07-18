import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType('WeightClass')
export class WeightClassSchema {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}
