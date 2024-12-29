import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  // Helper function to check if a Schedule exists
  private async checkScheduleExists(schedule_id: string): Promise<boolean> {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id: schedule_id },
    });
    return !!schedule; // Returns true if schedule exists, false otherwise
  }

  async create(createTaskDto: CreateTaskDto) {
    const scheduleExists = await this.checkScheduleExists(
      createTaskDto.schedule_id,
    );
    if (!scheduleExists) {
      throw new NotFoundException(
        `Schedule with ID ${createTaskDto.schedule_id} not found`,
      );
    }

    return this.prisma.task.create({
      data: createTaskDto,
    });
  }

  async findAll() {
    return this.prisma.task.findMany();
  }

  async findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    if (updateTaskDto.schedule_id) {
      const scheduleExists = await this.checkScheduleExists(
        updateTaskDto.schedule_id,
      );
      if (!scheduleExists) {
        throw new NotFoundException(
          `Schedule with ID ${updateTaskDto.schedule_id} not found`,
        );
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    await this.prisma.task.delete({ where: { id } });

    return { message: `Task with ID ${id} deleted successfully` };
  }
}
