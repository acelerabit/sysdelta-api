import { CityCouncilsRepository } from '@/application/repositories/city-council-repository';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from 'src/application/repositories/user-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-user-repository';
import { LogsRepository } from 'src/application/repositories/logs-repository';
import { PrismaLogsRepository } from './prisma/repositories/prisma-logs-repository';
import { NotificationRepository } from '@/application/repositories/notification-repository';
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository';
import { DateService } from '../dates/date.service';
import { PrismaCityCouncilsRepository } from './prisma/repositories/prisma-city-council-repository';

@Module({
  providers: [
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: LogsRepository,
      useClass: PrismaLogsRepository,
    },
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: CityCouncilsRepository,
      useClass: PrismaCityCouncilsRepository,
    },
    PrismaService,
    DateService,
  ],
  exports: [
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: LogsRepository,
      useClass: PrismaLogsRepository,
    },
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: CityCouncilsRepository,
      useClass: PrismaCityCouncilsRepository,
    },
    PrismaService,
  ],
})
export class DatabaseModule {}
