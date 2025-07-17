import { Field, ObjectType, ID } from '@nestjs/graphql';
import { FightSchema } from './fight.schema';

@ObjectType('Event')
export class EventSchema {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  location: string;

  @Field({ nullable: true })
  event_date?: string;

  @Field(() => [FightSchema], { nullable: true })
  fights?: FightSchema[];
}
