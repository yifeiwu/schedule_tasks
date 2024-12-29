import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createScheduleDto: CreateScheduleDto) {
    const { account_id, agent_id, start_time, end_time } = createScheduleDto;

    return await this.prisma.schedule.create({
      data: {
        account_id,
        agent_id,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
      },
    });
  }

  async findAll() {
    return this.prisma.schedule.findMany();
  }

  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return schedule;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const { start_time, end_time, ...rest } = updateScheduleDto;

    const schedule = await this.prisma.schedule.findUnique({ where: { id } });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return this.prisma.schedule.update({
      where: { id },
      data: {
        ...rest,
        ...(start_time && { start_time: new Date(start_time) }),
        ...(end_time && { end_time: new Date(end_time) }),
      },
    });
  }

  async remove(id: string) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    await this.prisma.schedule.delete({ where: { id } });

    return { message: `Schedule with ID ${id} deleted successfully` };
  }
}
