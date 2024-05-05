// schedule.module.ts

import { Module } from '@nestjs/common';
import { ScheduleService } from './schedules.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [ScheduleService],
  exports: [ScheduleService],
  imports: [ScheduleModule.forRoot()],
})
export class SchedulesModule {}
