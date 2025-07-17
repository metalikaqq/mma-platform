import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class UpdateFighterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  birth_date?: string;

  @IsOptional()
  @IsNumber()
  weightClassId?: number;
}
