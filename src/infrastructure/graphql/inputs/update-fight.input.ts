import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { FightResult } from '../../../domain/entities';

@InputType()
export class UpdateFightInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  eventId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  fighter1Id?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  fighter2Id?: string;

  @Field(() => FightResult, { nullable: true })
  @IsOptional()
  @IsEnum(FightResult)
  result?: FightResult;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  winnerId?: string;
}
