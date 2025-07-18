import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { EventService } from '../../../application/services/event.service';
import { EventSchema } from '../schemas/event.schema';
import { CreateEventInput } from '../inputs/create-event.input';
import { UpdateEventInput } from '../inputs/update-event.input';
import { Event } from '../../../domain/entities/event.entity';

@Resolver(() => EventSchema)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  private transformEventForGraphQL(
    event: Event,
    includeFights: boolean = true,
  ): EventSchema {
    const baseEvent = {
      ...event,
      event_date:
        event.event_date instanceof Date
          ? event.event_date.toISOString().split('T')[0]
          : (event.event_date ?? undefined),
    };

    if (includeFights && event.fights) {
      return {
        ...baseEvent,
        fights: event.fights.map((fight) => ({
          ...fight,
          event: {
            ...baseEvent,
            fights: undefined,
          },
          fighter1: fight.fighter1
            ? {
                ...fight.fighter1,
                birth_date:
                  fight.fighter1.birth_date instanceof Date
                    ? fight.fighter1.birth_date.toISOString().split('T')[0]
                    : (fight.fighter1.birth_date ?? undefined),
              }
            : undefined,
          fighter2: fight.fighter2
            ? {
                ...fight.fighter2,
                birth_date:
                  fight.fighter2.birth_date instanceof Date
                    ? fight.fighter2.birth_date.toISOString().split('T')[0]
                    : (fight.fighter2.birth_date ?? undefined),
              }
            : undefined,
          winner: fight.winner
            ? {
                ...fight.winner,
                birth_date:
                  fight.winner.birth_date instanceof Date
                    ? fight.winner.birth_date.toISOString().split('T')[0]
                    : (fight.winner.birth_date ?? undefined),
              }
            : undefined,
        })),
      };
    }

    const { fights: _fights, ...eventWithoutFights } = baseEvent;
    void _fights;
    return eventWithoutFights;
  }

  @Query(() => [EventSchema])
  async events(): Promise<EventSchema[]> {
    const events = await this.eventService.findAll();
    return events.map((event) => this.transformEventForGraphQL(event, true));
  }

  @Query(() => EventSchema)
  async event(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<EventSchema> {
    const event = await this.eventService.findById(id);
    return this.transformEventForGraphQL(event, true);
  }

  @Mutation(() => EventSchema)
  async createEvent(
    @Args('input') input: CreateEventInput,
  ): Promise<EventSchema> {
    const event = await this.eventService.create(input);
    return this.transformEventForGraphQL(event, true);
  }

  @Mutation(() => EventSchema)
  async updateEvent(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateEventInput,
  ): Promise<EventSchema> {
    const event = await this.eventService.update(id, input);
    return this.transformEventForGraphQL(event, true);
  }

  @Mutation(() => Boolean)
  async deleteEvent(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.eventService.delete(id);
    return true;
  }
}
