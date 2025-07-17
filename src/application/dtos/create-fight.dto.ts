import { IsNumber, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { FightResult } from '../../domain/entities';

export class CreateFightDto {
  @IsNumber()
  @IsNotEmpty()
  eventId: number;

  @IsNumber()
  @IsNotEmpty()
  fighter1Id: number;

  @IsNumber()
  @IsNotEmpty()
  fighter2Id: number;

  @IsEnum(FightResult)
  result: FightResult;

  @IsOptional()
  @IsNumber()
  winnerId?: number;
}
