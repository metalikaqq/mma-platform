import { Field, ObjectType, ID, Int, registerEnumType } from '@nestjs/graphql';
import { FightResult } from '../../../domain/entities';
import { FighterSchema } from './fighter.schema';
import { EventSchema } from './event.schema';

registerEnumType(FightResult, {
  name: 'FightResult',
});

@ObjectType('Fight')
export class FightSchema {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  eventId: string;

  @Field(() => ID)
  fighter1Id: string;

  @Field(() => ID)
  fighter2Id: string;

  @Field(() => FightResult)
  result: FightResult;

  @Field(() => ID, { nullable: true })
  winnerId?: string;

  @Field(() => EventSchema, { nullable: true })
  event?: EventSchema;

  @Field(() => FighterSchema, { nullable: true })
  fighter1?: FighterSchema;

  @Field(() => FighterSchema, { nullable: true })
  fighter2?: FighterSchema;

  @Field(() => FighterSchema, { nullable: true })
  winner?: FighterSchema;
}
