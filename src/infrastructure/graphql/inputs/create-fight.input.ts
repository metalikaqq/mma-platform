import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { FightResult } from '../../../domain/entities';

@InputType()
export class CreateFightInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  fighter1Id: string;

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  fighter2Id: string;

  @Field(() => FightResult)
  @IsEnum(FightResult)
  result: FightResult;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  winnerId?: string;
}
