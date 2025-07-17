import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FighterService } from '../../src/application/services/fighter.service';
import { IFighterRepository } from '../../src/domain/interfaces/fighter.repository.interface';
import { Fighter } from '../../src/domain/entities';

describe('FighterService', () => {
  let service: FighterService;
  let repository: jest.Mocked<IFighterRepository>;

  const mockFighter: Fighter = {
    id: 1,
    name: 'Test Fighter',
    birth_date: new Date('1990-01-01'),
    wins: 5,
    losses: 2,
    draws: 1,
    knockouts: 3,
    submissions: 1,
    weightClassId: 1,
    weightClass: null,
    fightsAsFighter1: [],
    fightsAsFighter2: [],
    wins_fights: [],
    rankings: [],
  };

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByWeightClass: jest.fn(),
      findWithStats: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateStats: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FighterService,
        {
          provide: 'IFighterRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FighterService>(FighterService);
    repository = module.get('IFighterRepository');
  });

  describe('findById', () => {
    it('should return a fighter when found', async () => {
      repository.findById.mockResolvedValue(mockFighter);

      const result = await service.findById(1);

      expect(result).toEqual(mockFighter);
      expect(repository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when fighter not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new fighter', async () => {
      const createDto = {
        name: 'New Fighter',
        birth_date: '1995-01-01',
        weightClassId: 1,
      };

      repository.create.mockResolvedValue(mockFighter);

      const result = await service.create(createDto);

      expect(result).toEqual(mockFighter);
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        birth_date: new Date(createDto.birth_date),
      });
    });
  });

  describe('updateFighterStats', () => {
    it('should update fighter stats for a win by KO', async () => {
      repository.findById.mockResolvedValue(mockFighter);
      repository.updateStats.mockResolvedValue(mockFighter);

      await service.updateFighterStats(1, 'win', 'KO');

      expect(repository.updateStats).toHaveBeenCalledWith(1, {
        wins: 6,
        knockouts: 4,
      });
    });

    it('should update fighter stats for a draw', async () => {
      repository.findById.mockResolvedValue(mockFighter);
      repository.updateStats.mockResolvedValue(mockFighter);

      await service.updateFighterStats(1, 'draw');

      expect(repository.updateStats).toHaveBeenCalledWith(1, {
        draws: 2,
      });
    });
  });
});
