import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from 'src/application/repositories/user-repository';
import { PrismaUsersRepository } from './prisma/repositiores/prisma-user-repository';
import { prismaExtensionFactory } from './prisma/prisma-extension';
import { LogsRepository } from 'src/application/repositories/logs-repository';
import { PrismaLogsRepository } from './prisma/repositiores/prisma-logs-repository';

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
      provide: PrismaService,
      useFactory: () => {
        return prismaExtensionFactory(new PrismaService());
      },
    },
  ],
})
export class DatabaseModule {}
