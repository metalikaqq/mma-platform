import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';

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

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  weightClassId?: string;
}
