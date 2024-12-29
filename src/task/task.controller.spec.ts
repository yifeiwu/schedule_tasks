import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Prisma, TaskType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;
  let prisma: PrismaService;
  let schedule_id: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);

    // valid schedule
    const schedule = await prisma.schedule.create({
      data: {
        account_id: 1,
        agent_id: 1,
        start_time: new Date('2024-12-29T09:00:00Z'),
        end_time: new Date('2024-12-29T17:00:00Z'),
      },
    });
    schedule_id = schedule.id;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      account_id: 1,
      schedule_id: schedule_id,
      start_time: new Date('2024-12-29T10:00:00Z'),
      duration: 60,
      type: TaskType.work,
    };

    it('should create a new task', async () => {
      const createdTask = {
        ...createDto,
        id: 'uuid-task-1234',
        start_time: new Date(createDto.start_time),
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdTask);

      const result = await controller.create(createDto);

      expect(result).toEqual(createdTask);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks = [
        {
          id: 'uuid-task-1234',
          account_id: 1,
          schedule_id: schedule_id,
          start_time: new Date('2024-12-29T10:00:00Z'),
          duration: 60,
          type: TaskType.work,
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(tasks);

      const result = await controller.findAll();

      expect(result).toEqual(tasks);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const taskId = 'uuid-1234';

    it('should return a single task', async () => {
      const task = {
        id: taskId,
        account_id: 1,
        schedule_id: schedule_id,
        start_time: new Date('2024-12-29T10:00:00Z'),
        duration: 60,
        type: TaskType.work,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(task);

      const result = await controller.findOne(taskId);

      expect(result).toEqual(task);
      expect(service.findOne).toHaveBeenCalledWith(taskId);
    });

    it('should throw an error if the task does not exist', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new Error('Task not found'));

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
        'Task not found',
      );
      expect(service.findOne).toHaveBeenCalledWith('nonexistent-id');
    });
  });

  describe('update', () => {
    const taskId = 'uuid-1234';
    const updateDto = {
      start_time: new Date('2024-12-29T10:00:00Z'),
    };

    it('should update a task and return the updated entity', async () => {
      const updatedTask = {
        id: taskId,
        account_id: 1,
        schedule_id: schedule_id,
        start_time: new Date('2024-12-29T10:00:00Z'),
        duration: 60,
        type: TaskType.work,
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedTask);

      const result = await controller.update(taskId, updateDto);

      expect(result).toEqual(updatedTask);
      expect(service.update).toHaveBeenCalledWith(taskId, updateDto);
    });

    it('should throw an error if the update fails', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new Error('Update failed'));

      await expect(controller.update(taskId, updateDto)).rejects.toThrow(
        'Update failed',
      );
      expect(service.update).toHaveBeenCalledWith(taskId, updateDto);
    });
  });

  describe('remove', () => {
    const taskId = 'uuid-1234';

    it('should remove a task', async () => {
      jest
        .spyOn(service, 'remove')
        .mockResolvedValue({ message: 'Task deleted successfully' });

      const result = await controller.remove(taskId);

      expect(result).toEqual({ message: 'Task deleted successfully' });
      expect(service.remove).toHaveBeenCalledWith(taskId);
    });

    it('should throw an error if the task does not exist', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new Error('Task not found'));

      await expect(controller.remove('nonexistent-id')).rejects.toThrow(
        'Task not found',
      );
      expect(service.remove).toHaveBeenCalledWith('nonexistent-id');
    });
  });
});
