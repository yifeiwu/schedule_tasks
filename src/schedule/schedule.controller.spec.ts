import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

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

// Mock service
const mockScheduleService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ScheduleController', () => {
  let controller: ScheduleController;
  let service: ScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [
        {
          provide: ScheduleService,
          useValue: mockScheduleService,
        },
      ],
    }).compile();

    controller = module.get<ScheduleController>(ScheduleController);
    service = module.get<ScheduleService>(ScheduleService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      account_id: 1,
      agent_id: 1,
      start_time: new Date('2024-12-29T10:00:00Z'),
      end_time: new Date('2024-12-29T18:00:00Z'),
    };

    it('should create a new schedule', async () => {
      mockScheduleService.create.mockResolvedValue(mockSchedule);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockSchedule);
      expect(mockScheduleService.create).toHaveBeenCalledWith(createDto);
      expect(mockScheduleService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if creation fails', async () => {
      const error = new Error('Failed to create schedule');
      mockScheduleService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow(error);
      expect(mockScheduleService.create).toHaveBeenCalledWith(createDto);
      expect(mockScheduleService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of schedules', async () => {
      mockScheduleService.findAll.mockResolvedValue(mockSchedules);

      const result = await controller.findAll();

      expect(result).toEqual(mockSchedules);
      expect(mockScheduleService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no schedules exist', async () => {
      mockScheduleService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockScheduleService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if retrieval fails', async () => {
      const error = new Error('Failed to retrieve schedules');
      mockScheduleService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
      expect(mockScheduleService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single schedule', async () => {
      mockScheduleService.findOne.mockResolvedValue(mockSchedule);

      const result = await controller.findOne(mockSchedule.id);

      expect(result).toEqual(mockSchedule);
      expect(mockScheduleService.findOne).toHaveBeenCalledWith(mockSchedule.id);
      expect(mockScheduleService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if schedule not found', async () => {
      const error = new Error('Schedule not found');
      mockScheduleService.findOne.mockRejectedValue(error);

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(error);
      expect(mockScheduleService.findOne).toHaveBeenCalledWith('non-existent-id');
      expect(mockScheduleService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    const updateDto = {
      start_time: new Date('2024-12-29T11:00:00Z'),
      end_time: new Date('2024-12-29T19:00:00Z'),
    };

    it('should update a schedule and return the updated entity', async () => {
      const updatedSchedule = {
        ...mockSchedule,
        ...updateDto,
      };

      mockScheduleService.update.mockResolvedValue(updatedSchedule);

      const result = await controller.update(mockSchedule.id, updateDto);

      expect(result).toEqual(updatedSchedule);
      expect(mockScheduleService.update).toHaveBeenCalledWith(
        mockSchedule.id,
        updateDto
      );
      expect(mockScheduleService.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if update fails', async () => {
      const error = new Error('Failed to update schedule');
      mockScheduleService.update.mockRejectedValue(error);

      await expect(
        controller.update(mockSchedule.id, updateDto)
      ).rejects.toThrow(error);
      expect(mockScheduleService.update).toHaveBeenCalledWith(
        mockSchedule.id,
        updateDto
      );
      expect(mockScheduleService.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a schedule', async () => {
      const deleteResponse = { message: `Schedule with ID ${mockSchedule.id} deleted successfully` };
      mockScheduleService.remove.mockResolvedValue(deleteResponse);

      const result = await controller.remove(mockSchedule.id);

      expect(result).toEqual(deleteResponse);
      expect(mockScheduleService.remove).toHaveBeenCalledWith(mockSchedule.id);
      expect(mockScheduleService.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if deletion fails', async () => {
      const error = new Error('Failed to delete schedule');
      mockScheduleService.remove.mockRejectedValue(error);

      await expect(controller.remove(mockSchedule.id)).rejects.toThrow(error);
      expect(mockScheduleService.remove).toHaveBeenCalledWith(mockSchedule.id);
      expect(mockScheduleService.remove).toHaveBeenCalledTimes(1);
    });
  });
});