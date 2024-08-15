import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from 'src/application/repositories/user-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-user-repository';
import { prismaExtensionFactory } from './prisma/prisma-extension';
import { LogsRepository } from 'src/application/repositories/logs-repository';
import { PrismaLogsRepository } from './prisma/repositories/prisma-logs-repository';
import { NotificationRepository } from '@/application/repositories/notification-repository';
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository';
import { DateService } from '../dates/date.service';

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
      provide: PrismaService,
      useFactory: () => {
        return prismaExtensionFactory(new PrismaService());
      },
    },
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
      provide: PrismaService,
      useFactory: () => {
        return prismaExtensionFactory(new PrismaService());
      },
    },
  ],
})
export class DatabaseModule {}
