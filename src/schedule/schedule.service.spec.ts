import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleService, PrismaService],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new schedule', async () => {
      const createDto = {
        account_id: 1,
        agent_id: 1,
        start_time: new Date('2024-12-29T10:00:00Z'),
        end_time: new Date('2025-12-29T10:00:00Z'),
      };
      const expectedSchedule = {
        ...createDto,
        id: 'uuid-1234',
      };

      const { id: _, ...createScheduleParams } = expectedSchedule;

      jest.spyOn(prisma.schedule, 'create').mockResolvedValue(expectedSchedule);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedSchedule);
      expect(prisma.schedule.create).toHaveBeenCalledWith({
        data: createScheduleParams,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of schedules', async () => {
      const schedules = [
        {
          id: 'uuid-1',
          account_id: 1,
          agent_id: 1,
          start_time: new Date(),
          end_time: new Date(),
        },
        {
          id: 'uuid-2',
          account_id: 2,
          agent_id: 2,
          start_time: new Date(),
          end_time: new Date(),
        },
      ];

      jest.spyOn(prisma.schedule, 'findMany').mockResolvedValue(schedules);

      const result = await service.findAll();

      expect(result).toEqual(schedules);
      expect(prisma.schedule.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single schedule', async () => {
      const schedule = {
        id: 'uuid-1234',
        account_id: 1,
        agent_id: 1,
        start_time: new Date(),
        end_time: new Date(),
      };

      jest.spyOn(prisma.schedule, 'findUnique').mockResolvedValue(schedule);

      const result = await service.findOne('uuid-1234');

      expect(result).toEqual(schedule);
      expect(prisma.schedule.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1234' },
      });
    });
  });

  describe('update', () => {
    it('should update a schedule with the provided fields', async () => {
      const updateDto = {
        start_time: new Date('2024-12-29T10:00:00Z'),
        end_time: new Date('2025-12-29T10:00:00Z'),
      };

      const scheduleId = 'uuid-1234';
      const updatedSchedule = {
        id: scheduleId,
        account_id: 1,
        agent_id: 1,
        start_time: new Date(updateDto.start_time),
        end_time: new Date(updateDto.end_time),
      };

      jest
        .spyOn(prisma.schedule, 'findUnique')
        .mockResolvedValue(updatedSchedule);
      jest.spyOn(prisma.schedule, 'update').mockResolvedValue(updatedSchedule);

      const result = await service.update(scheduleId, updateDto);

      expect(result).toEqual(updatedSchedule);
      expect(prisma.schedule.update).toHaveBeenCalledWith({
        where: { id: scheduleId },
        data: {
          start_time: new Date(updateDto.start_time),
          end_time: new Date(updateDto.end_time),
        },
      });
    });
  });

  describe('remove', () => {
    it('should delete a schedule', async () => {
      jest.spyOn(prisma.schedule, 'findUnique').mockResolvedValue({} as any);
      jest.spyOn(prisma.schedule, 'delete').mockResolvedValue({} as any);

      const result = await service.remove('uuid-1234');

      expect(result).toEqual({
        message: `Schedule with ID uuid-1234 deleted successfully`,
      });
      expect(prisma.schedule.delete).toHaveBeenCalledWith({
        where: { id: 'uuid-1234' },
      });
    });
  });
});
