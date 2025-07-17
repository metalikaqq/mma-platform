import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsEnum, IsOptional } from 'class-validator';
import { FightResult } from '../../../domain/entities';

@InputType()
export class UpdateFightInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  eventId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  fighter1Id?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  fighter2Id?: number;

  @Field(() => FightResult, { nullable: true })
  @IsOptional()
  @IsEnum(FightResult)
  result?: FightResult;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  winnerId?: number;
}
