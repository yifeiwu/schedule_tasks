import { IsInt, IsNotEmpty, IsUUID, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateScheduleDto {
  @IsInt()
  @IsNotEmpty()
  account_id: number;

  @IsInt()
  @IsNotEmpty()
  agent_id: number;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  start_time: Date;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  end_time: Date;
}
