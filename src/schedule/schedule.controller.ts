import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  async create(@Body() createScheduleDto: CreateScheduleDto) {
    return await this.scheduleService.create(createScheduleDto);
  }

  @Get()
  async findAll() {
    return await this.scheduleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.scheduleService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return await this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.scheduleService.remove(id);
  }
}
