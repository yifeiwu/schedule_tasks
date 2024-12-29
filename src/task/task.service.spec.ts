import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskType } from '@prisma/client';

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, PrismaService],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('should throw an error if schedule does not exist', async () => {
      const createTaskDto = {
        account_id: 1,
        schedule_id: 'nonexistent-id', // Invalid Schedule ID
        start_time: new Date('2024-12-29T10:00:00Z'),
        duration: 60,
        type: TaskType.work,
      };

      await expect(service.create(createTaskDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should create a task if schedule exists', async () => {
      // Create a schedule to use for the task
      const schedule = await prisma.schedule.create({
        data: {
          account_id: 1,
          agent_id: 1,
          start_time: new Date('2024-12-29T09:00:00Z'),
          end_time: new Date('2024-12-29T17:00:00Z'),
        },
      });

      const createTaskDto = {
        account_id: 1,
        schedule_id: schedule.id,
        start_time: new Date('2024-12-29T10:00:00Z'),
        duration: 60,
        type: TaskType.work,
      };

      const task = await service.create(createTaskDto);
      expect(task).toHaveProperty('id');
      expect(task.schedule_id).toBe(schedule.id);
    });
  });

  describe('update', () => {
    it('should throw an error if schedule does not exist during update', async () => {
      const updateTaskDto = {
        schedule_id: 'nonexistent-id',
        start_time: new Date('2024-12-29T10:00:00Z'),
        duration: 90,
        type: TaskType.work,
      };

      const schedule = await prisma.schedule.create({
        data: {
          account_id: 1,
          agent_id: 1,
          start_time: new Date('2024-12-29T09:00:00Z'),
          end_time: new Date('2024-12-29T17:00:00Z'),
        },
      });

      const task = await prisma.task.create({
        data: {
          account_id: 1,
          schedule_id: schedule.id,
          start_time: new Date('2024-12-29T10:00:00Z'),
          duration: 60,
          type: TaskType.work,
        },
      });

      await expect(service.update(task.id, updateTaskDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update the task if schedule exists', async () => {
      // Create a schedule
      const schedule = await prisma.schedule.create({
        data: {
          account_id: 1,
          agent_id: 1,
          start_time: new Date('2024-12-29T09:00:00Z'),
          end_time: new Date('2024-12-29T17:00:00Z'),
        },
      });

      // Create a task
      const task = await prisma.task.create({
        data: {
          account_id: 1,
          schedule_id: schedule.id,
          start_time: new Date('2024-12-29T10:00:00Z'),
          duration: 60,
          type: TaskType.work,
        },
      });

      const updateTaskDto = {
        schedule_id: schedule.id,
        duration: 120,
        type: TaskType.work,
      };

      const updatedTask = await service.update(task.id, updateTaskDto);
      expect(updatedTask.duration).toBe(120);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const schedule = await prisma.schedule.create({
        data: {
          account_id: 1,
          agent_id: 1,
          start_time: new Date('2024-12-29T09:00:00Z'),
          end_time: new Date('2024-12-29T17:00:00Z'),
        },
      });

      const task = await prisma.task.create({
        data: {
          account_id: 1,
          schedule_id: schedule.id,
          start_time: new Date('2024-12-29T10:00:00Z'),
          duration: 60,
          type: TaskType.work,
        },
      });

      await expect(service.remove(task.id)).resolves.not.toThrow();
      const deletedTask = await prisma.task.findUnique({
        where: { id: task.id },
      });
      expect(deletedTask).toBeNull();
    });
  });
});
