import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskType } from '@prisma/client';

// Mock data
const mockSchedule = {
  id: 'schedule-uuid-1234',
  account_id: 1,
  agent_id: 1,
  start_time: new Date('2024-12-29T09:00:00Z'),
  end_time: new Date('2024-12-29T17:00:00Z'),
};

const mockTask = {
  id: 'task-uuid-1234',
  account_id: 1,
  schedule_id: mockSchedule.id,
  start_time: new Date('2024-12-29T10:00:00Z'),
  duration: 60,
  type: TaskType.work,
};

// Mock PrismaService
const mockPrismaService = {
  schedule: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  task: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $disconnect: jest.fn(),
};

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    const createTaskDto = {
      account_id: 1,
      schedule_id: mockSchedule.id,
      start_time: new Date('2024-12-29T10:00:00Z'),
      duration: 60,
      type: TaskType.work,
    };

    it('should throw an error if schedule does not exist', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(null);

      await expect(service.create({
        ...createTaskDto,
        schedule_id: 'nonexistent-id',
      })).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.schedule.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
    });

    it('should create a task if schedule exists', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(mockSchedule);
      mockPrismaService.task.create.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto);

      expect(result).toEqual(mockTask);
      expect(mockPrismaService.schedule.findUnique).toHaveBeenCalledWith({
        where: { id: mockSchedule.id },
      });
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: createTaskDto,
      });
    });
  });

  describe('update', () => {
    const updateTaskDto = {
      duration: 120,
      type: TaskType.work,
    };

    it('should throw an error if task does not exist', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.update('nonexistent-id', updateTaskDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockPrismaService.task.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
    });

    it('should throw an error if schedule does not exist during update', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);
      mockPrismaService.schedule.findUnique.mockResolvedValue(null);

      await expect(service.update(mockTask.id, {
        ...updateTaskDto,
        schedule_id: 'nonexistent-id',
      })).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.schedule.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
    });

    it('should update the task if all validations pass', async () => {
      const updatedTask = { ...mockTask, ...updateTaskDto };
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);
      mockPrismaService.schedule.findUnique.mockResolvedValue(mockSchedule);
      mockPrismaService.task.update.mockResolvedValue(updatedTask);

      const result = await service.update(mockTask.id, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: mockTask.id },
        data: updateTaskDto,
      });
    });
  });

  describe('remove', () => {
    it('should throw an error if task does not exist', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockPrismaService.task.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
    });

    it('should remove a task successfully', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);
      mockPrismaService.task.delete.mockResolvedValue(mockTask);

      const result = await service.remove(mockTask.id);

      expect(result).toEqual({
        message: `Task with ID ${mockTask.id} deleted successfully`,
      });
      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({
        where: { id: mockTask.id },
      });
    });
  });

  describe('findBySchedule', () => {
    it('should throw an error if schedule does not exist', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(null);

      await expect(service.findBySchedule('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockPrismaService.schedule.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
    });

    it('should return tasks for a schedule', async () => {
      const mockTasks = [mockTask, { ...mockTask, id: 'task-uuid-5678' }];
      mockPrismaService.schedule.findUnique.mockResolvedValue(mockSchedule);
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);

      const result = await service.findBySchedule(mockSchedule.id);

      expect(result).toEqual(mockTasks);
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: { schedule_id: mockSchedule.id },
      });
    });

    it('should return empty array if schedule has no tasks', async () => {
      mockPrismaService.schedule.findUnique.mockResolvedValue(mockSchedule);
      mockPrismaService.task.findMany.mockResolvedValue([]);

      const result = await service.findBySchedule(mockSchedule.id);

      expect(result).toEqual([]);
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: { schedule_id: mockSchedule.id },
      });
    });
  });
});