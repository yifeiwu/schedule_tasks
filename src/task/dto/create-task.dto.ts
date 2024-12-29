import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsUUID,
  IsDate,
  IsEnum,
} from 'class-validator';
import { TaskType } from '@prisma/client';

export class CreateTaskDto {
  @IsInt()
  @IsNotEmpty()
  account_id: number;

  @IsUUID()
  @IsNotEmpty()
  schedule_id: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  start_time: Date;

  @IsInt()
  @IsNotEmpty()
  duration: number;

  @IsEnum(TaskType)
  type: TaskType;
}
