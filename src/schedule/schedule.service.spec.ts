import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { PrismaService } from '../prisma/prisma.service';

// Mock data
const mockSchedule = {
  id: 'uuid-1234',
  account_id: 1,
  agent_id: 1,
  start_time: new Date('2024-12-29T10:00:00Z'),
  end_time: new Date('2024-12-29T18:00:00Z'),
};

const mockSchedules = [
  mockSchedule,
  {
    id: 'uuid-5678',
    account_id: 2,
    agent_id: 2,
    start_time: new Date('2024-12-30T10:00:00Z'),
    end_time: new Date('2024-12-30T18:00:00Z'),
  },
];

// Mock PrismaService
const mockPrismaService = {
  schedule: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ScheduleService', () => {
  let service: ScheduleService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new schedule', async () => {
      const createDto = {
        account_id: 1,
        agent_id: 1,
        start_time: new Date('2024-12-29T10:00:00Z'),
        end_time: new Date('2024-12-29T18:00:00Z'),
      };

      mockPrismaService.schedule.create.mockResolvedValue(mockSchedule);

      const result = await service.create(createDto);

      expect(result).toEqual(mockSchedule);
      expect(mockPrismaService.schedule.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(mockPrismaService.schedule.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if creation fails', async () => {
      const createDto = {
        account_id: 1,
        agent_id: 1,
        start_time: new Date('2024-12-29T10:00:00Z'),
        end_time: new Date('2024-12-29T18:00:00Z'),
      };

      const error = new Error('Database error');
      mockPrismaService.schedule.create.mockRejectedValue(error);

      await expect(service.create(createDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return an array of schedules', async () => {
      mockPrismaService.schedule.findMany.mockResolvedValue(mockSchedules);

      const result = await service.findAll();

      expect(result).toEqual(mockSchedules);
      expect(mockPrismaService.schedule.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no schedules exist', async () => {
      mockPrismaService.schedule.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockPrismaService.schedule.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single schedule', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(mockSchedule);

      const result = await service.findOne('uuid-1234');

      expect(result).toEqual(mockSchedule);
      expect(mockPrismaService.schedule.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1234' },
      });
    });

    it('should return null if schedule not found', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow('Schedule with ID non-existent-id not found');

      expect(mockPrismaService.schedule.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
    });
  });

  describe('update', () => {
    it('should update a schedule with the provided fields', async () => {
      const updateDto = {
        start_time: new Date('2024-12-02'),
        end_time: new Date('2024-12-05'),
      };

      const updatedSchedule = {
        ...mockSchedule,
        start_time: new Date(updateDto.start_time),
        end_time: new Date(updateDto.end_time),
      };

      mockPrismaService.schedule.findUnique.mockResolvedValue(mockSchedule);
      mockPrismaService.schedule.update.mockResolvedValue(updatedSchedule);

      const result = await service.update('uuid-1234', updateDto);

      expect(result).toEqual(updatedSchedule);
      expect(mockPrismaService.schedule.update).toHaveBeenCalledWith({
        where: { id: 'uuid-1234' },
        data: {
          start_time: new Date(updateDto.start_time),
          end_time: new Date(updateDto.end_time),
        },
      });
    });

    it('should throw an error if schedule not found', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { start_time: new Date('2024-12-02') })
      ).rejects.toThrow('Schedule with ID non-existent-id not found');
    });
  });

  describe('remove', () => {
    it('should delete a schedule', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(mockSchedule);
      mockPrismaService.schedule.delete.mockResolvedValue(mockSchedule);

      const result = await service.remove('uuid-1234');

      expect(result).toEqual({
        message: 'Schedule with ID uuid-1234 deleted successfully',
      });
      expect(mockPrismaService.schedule.delete).toHaveBeenCalledWith({
        where: { id: 'uuid-1234' },
      });
    });

    it('should throw an error if schedule not found', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        'Schedule with ID non-existent-id not found'
      );
    });
  });
});