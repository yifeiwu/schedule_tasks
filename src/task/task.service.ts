import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  private async checkScheduleExists(schedule_id: string): Promise<void> {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id: schedule_id },
    });
    if (!schedule) {
      throw new NotFoundException(
        `Schedule with ID ${schedule_id} not found`
      );
    }
  }

  private async checkTaskExists(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto) {
    await this.checkScheduleExists(createTaskDto.schedule_id);

    return this.prisma.task.create({
      data: createTaskDto,
    });
  }

  async findAll() {
    return this.prisma.task.findMany();
  }

  async findOne(id: string) {
    const task = await this.checkTaskExists(id);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.checkTaskExists(id);

    if (updateTaskDto.schedule_id) {
      await this.checkScheduleExists(updateTaskDto.schedule_id);
    }

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: string) {
    await this.checkTaskExists(id);

    await this.prisma.task.delete({
      where: { id },
    });

    return {
      message: `Task with ID ${id} deleted successfully`,
    };
  }

  async findBySchedule(schedule_id: string) {
    await this.checkScheduleExists(schedule_id);

    return this.prisma.task.findMany({
      where: { schedule_id },
    });
  }
}