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
  id: number;

  @Field(() => Int)
  eventId: number;

  @Field(() => Int)
  fighter1Id: number;

  @Field(() => Int)
  fighter2Id: number;

  @Field(() => FightResult)
  result: FightResult;

  @Field(() => Int, { nullable: true })
  winnerId?: number;

  @Field(() => EventSchema, { nullable: true })
  event?: EventSchema;

  @Field(() => FighterSchema, { nullable: true })
  fighter1?: FighterSchema;

  @Field(() => FighterSchema, { nullable: true })
  fighter2?: FighterSchema;

  @Field(() => FighterSchema, { nullable: true })
  winner?: FighterSchema;
}
