import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

describe('ScheduleController', () => {
  let controller: ScheduleController;
  let service: ScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [
        {
          provide: ScheduleService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ScheduleController>(ScheduleController);
    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      account_id: 1,
      agent_id: 1,
      start_time: new Date('2024-12-29T10:00:00Z'),
      end_time: new Date('2025-12-29T10:00:00Z'),
    };

    it('should create a new schedule', async () => {
      const createdSchedule = {
        id: 'uuid-1234',
        ...createDto,
        start_time: new Date(createDto.start_time),
        end_time: new Date(createDto.end_time),
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdSchedule);

      const result = await controller.create(createDto);

      expect(result).toEqual(createdSchedule);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of schedules', async () => {
      const schedules = [
        {
          id: 'uuid-1234',
          account_id: 1,
          agent_id: 1,
          start_time: new Date('2023-12-02'),
          end_time: new Date('2024-12-02'),
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(schedules);

      const result = await controller.findAll();

      expect(result).toEqual(schedules);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const scheduleId = 'uuid-1234';

    it('should return a single schedule', async () => {
      const schedule = {
        id: scheduleId,
        account_id: 1,
        agent_id: 1,
        start_time: new Date('2023-12-02'),
        end_time: new Date('2024-12-02'),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(schedule);

      const result = await controller.findOne(scheduleId);

      expect(result).toEqual(schedule);
      expect(service.findOne).toHaveBeenCalledWith(scheduleId);
    });

    it('should throw an error if the schedule does not exist', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new Error('Schedule not found'));

      await expect(controller.findOne('nonexistent-id')).rejects.toThrow(
        'Schedule not found',
      );
      expect(service.findOne).toHaveBeenCalledWith('nonexistent-id');
    });
  });

  describe('update', () => {
    const scheduleId = 'uuid-1234';
    const updateDto = {
      start_time: new Date('2024-12-29T10:00:00Z'),
    };

    it('should update a schedule and return the updated entity', async () => {
      const updatedSchedule = {
        id: scheduleId,
        account_id: 1,
        agent_id: 1,
        start_time: updateDto.start_time,
        end_time: new Date('2024-12-02'),
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedSchedule);

      const result = await controller.update(scheduleId, updateDto);

      expect(result).toEqual(updatedSchedule);
      expect(service.update).toHaveBeenCalledWith(scheduleId, updateDto);
    });

    it('should throw an error if the update fails', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new Error('Update failed'));

      await expect(controller.update(scheduleId, updateDto)).rejects.toThrow(
        'Update failed',
      );
      expect(service.update).toHaveBeenCalledWith(scheduleId, updateDto);
    });
  });

  describe('remove', () => {
    const scheduleId = 'uuid-1234';

    it('should remove a schedule', async () => {
      jest
        .spyOn(service, 'remove')
        .mockResolvedValue({ message: 'Schedule deleted successfully' });

      const result = await controller.remove(scheduleId);

      expect(result).toEqual({ message: 'Schedule deleted successfully' });
      expect(service.remove).toHaveBeenCalledWith(scheduleId);
    });

    it('should throw an error if the schedule does not exist', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new Error('Schedule not found'));

      await expect(controller.remove('nonexistent-id')).rejects.toThrow(
        'Schedule not found',
      );
      expect(service.remove).toHaveBeenCalledWith('nonexistent-id');
    });
  });
});
