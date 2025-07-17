import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

@InputType()
export class UpdateFighterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  birth_date?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  weightClassId?: number;
}
