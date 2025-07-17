import { Injectable } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { IRepository } from '../../domain/interfaces/repository.interface';

@Injectable()
export class GenericRepository<T extends ObjectLiteral>
  implements IRepository<T>
{
  constructor(private readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<T | null> {
    return this.repository.findOne({ where: { id } } as any);
  }

  async create(entity: Partial<T>): Promise<T> {
    const created = this.repository.create(entity as any);
    const saved = await this.repository.save(created);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async update(id: number, entity: Partial<T>): Promise<T> {
    await this.repository.update(id, entity as any);
    return this.findById(id) as Promise<T>;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
