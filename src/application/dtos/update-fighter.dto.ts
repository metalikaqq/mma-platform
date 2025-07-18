import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class UpdateFighterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  birth_date?: string;

  @IsOptional()
  @IsUUID()
  weightClassId?: string;
}
