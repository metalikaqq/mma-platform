import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Event } from '../../domain/entities';
import { IRepository } from '../../domain/interfaces/repository.interface';
import { CreateEventDto } from '../dtos/create-event.dto';

@Injectable()
export class EventService {
  constructor(
    @Inject('IRepository<Event>')
    private readonly eventRepository: IRepository<Event>,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }

  async findById(id: string): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const eventData = {
      ...createEventDto,
      event_date: new Date(createEventDto.event_date),
    };
    return this.eventRepository.create(eventData);
  }

  async update(
    id: string,
    updateEventDto: Partial<CreateEventDto>,
  ): Promise<Event> {
    await this.findById(id);
    const updateData = {
      ...updateEventDto,
      event_date: updateEventDto.event_date
        ? new Date(updateEventDto.event_date)
        : undefined,
    };
    return this.eventRepository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.eventRepository.delete(id);
  }
}
