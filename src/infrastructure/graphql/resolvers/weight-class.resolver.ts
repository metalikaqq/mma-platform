import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WeightClassSchema } from '../schemas/weight-class.schema';
import { CreateWeightClassInput } from '../inputs/create-weight-class.input';
import { WeightClass } from '../../../domain/entities/weight-class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Resolver(() => WeightClassSchema)
export class WeightClassResolver {
  constructor(
    @InjectRepository(WeightClass)
    private readonly weightClassRepository: Repository<WeightClass>,
  ) {}

  @Query(() => [WeightClassSchema])
  async weightClasses(): Promise<WeightClassSchema[]> {
    return this.weightClassRepository.find();
  }

  @Mutation(() => WeightClassSchema)
  async createWeightClass(
    @Args('input') input: CreateWeightClassInput,
  ): Promise<WeightClassSchema> {
    const weightClass = this.weightClassRepository.create(input);
    return this.weightClassRepository.save(weightClass);
  }

  @Mutation(() => Boolean)
  async deleteWeightClass(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    const result = await this.weightClassRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  @Mutation(() => Boolean)
  async deleteAllWeightClasses(): Promise<boolean> {
    // Delete all data in correct order to handle foreign key constraints:
    // 1. Delete rankings (they reference fighters and weight classes)
    await this.weightClassRepository.query('DELETE FROM rankings');
    
    // 2. Delete fights (they reference fighters and events)
    await this.weightClassRepository.query('DELETE FROM fights');
    
    // 3. Delete fighters (they reference weight classes)
    await this.weightClassRepository.query('DELETE FROM fighters');
    
    // 4. Delete events
    await this.weightClassRepository.query('DELETE FROM events');
    
    // 5. Delete weight classes
    await this.weightClassRepository.query('DELETE FROM weight_classes');
    
    return true;
  }
}
