import { IsUUID, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { FightResult } from '../../domain/entities';

export class CreateFightDto {
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @IsUUID()
  @IsNotEmpty()
  fighter1Id: string;

  @IsUUID()
  @IsNotEmpty()
  fighter2Id: string;

  @IsEnum(FightResult)
  result: FightResult;

  @IsOptional()
  @IsUUID()
  winnerId?: string;
}
