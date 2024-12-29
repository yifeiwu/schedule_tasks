import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
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

// Mock TaskService
const mockTaskService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findBySchedule: jest.fn(),
};

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createTaskDto = {
      account_id: mockTask.account_id,
      schedule_id: mockTask.schedule_id,
      start_time: mockTask.start_time,
      duration: mockTask.duration,
      type: mockTask.type,
    };

    it('should create a new task', async () => {
      mockTaskService.create.mockResolvedValue(mockTask);

      const result = await controller.create(createTaskDto);

      expect(result).toEqual(mockTask);
      expect(mockTaskService.create).toHaveBeenCalledWith(createTaskDto);
      expect(mockTaskService.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if creation fails', async () => {
      const error = new Error('Failed to create task');
      mockTaskService.create.mockRejectedValue(error);

      await expect(controller.create(createTaskDto)).rejects.toThrow(error);
      expect(mockTaskService.create).toHaveBeenCalledWith(createTaskDto);
      expect(mockTaskService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const mockTasks = [mockTask, { ...mockTask, id: 'task-uuid-5678' }];
      mockTaskService.findAll.mockResolvedValue(mockTasks);

      const result = await controller.findAll();

      expect(result).toEqual(mockTasks);
      expect(mockTaskService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no tasks exist', async () => {
      mockTaskService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockTaskService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      mockTaskService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne(mockTask.id);

      expect(result).toEqual(mockTask);
      expect(mockTaskService.findOne).toHaveBeenCalledWith(mockTask.id);
      expect(mockTaskService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if task not found', async () => {
      const error = new Error('Task not found');
      mockTaskService.findOne.mockRejectedValue(error);

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(error);
      expect(mockTaskService.findOne).toHaveBeenCalledWith('non-existent-id');
      expect(mockTaskService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    const updateTaskDto = {
      start_time: new Date('2024-12-29T11:00:00Z'),
      duration: 90,
    };

    it('should update a task and return the updated entity', async () => {
      const updatedTask = {
        ...mockTask,
        ...updateTaskDto,
      };

      mockTaskService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(mockTask.id, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(mockTaskService.update).toHaveBeenCalledWith(mockTask.id, updateTaskDto);
      expect(mockTaskService.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if update fails', async () => {
      const error = new Error('Update failed');
      mockTaskService.update.mockRejectedValue(error);

      await expect(controller.update(mockTask.id, updateTaskDto)).rejects.toThrow(error);
      expect(mockTaskService.update).toHaveBeenCalledWith(mockTask.id, updateTaskDto);
      expect(mockTaskService.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const deleteResponse = { 
        message: `Task with ID ${mockTask.id} deleted successfully` 
      };
      mockTaskService.remove.mockResolvedValue(deleteResponse);

      const result = await controller.remove(mockTask.id);

      expect(result).toEqual(deleteResponse);
      expect(mockTaskService.remove).toHaveBeenCalledWith(mockTask.id);
      expect(mockTaskService.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if deletion fails', async () => {
      const error = new Error('Failed to delete task');
      mockTaskService.remove.mockRejectedValue(error);

      await expect(controller.remove(mockTask.id)).rejects.toThrow(error);
      expect(mockTaskService.remove).toHaveBeenCalledWith(mockTask.id);
      expect(mockTaskService.remove).toHaveBeenCalledTimes(1);
    });
  });
});