import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from 'src/application/repositories/user-repository';
import { PrismaUsersRepository } from './prisma/repositiores/prisma-user-repository';
import { prismaExtensionFactory } from './prisma/prisma-extension';
import { LogsRepository } from 'src/application/repositories/logs-repository';
import { PrismaLogsRepository } from './prisma/repositiores/prisma-logs-repository';
import { NotificationRepository } from '@/application/repositories/notification-repository';
import { PrismaNotificationsRepository } from './prisma/repositiores/prisma-notifications-repository';

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
