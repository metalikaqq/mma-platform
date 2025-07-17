import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { FightResult } from '../../../domain/entities';

@InputType()
export class CreateFightInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  eventId: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  fighter1Id: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  fighter2Id: number;

  @Field(() => FightResult)
  @IsEnum(FightResult)
  result: FightResult;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  winnerId?: number;
}
