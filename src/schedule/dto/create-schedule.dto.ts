import { IsInt, IsNotEmpty, IsUUID, IsDateString } from 'class-validator';

export class CreateScheduleDto {
  @IsInt()
  @IsNotEmpty()
  account_id: number;

  @IsInt()
  @IsNotEmpty()
  agent_id: number;

  @IsDateString()
  @IsNotEmpty()
  start_time: string;

  @IsDateString()
  @IsNotEmpty()
  end_time: string;
}
