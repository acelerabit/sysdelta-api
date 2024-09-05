import { CityCouncilsRepository } from '@/application/repositories/city-council-repository';
import { LegislativeMattersRepository } from '@/application/repositories/legislative-matter-repository';
import { NotificationRepository } from '@/application/repositories/notification-repository';
import { OfficesRepository } from '@/application/repositories/office-repository';
import { OrderDaysRepository } from '@/application/repositories/order-of-the-day-repository';
import { SessionsRepository } from '@/application/repositories/session-repository';
import { Module } from '@nestjs/common';
import { LogsRepository } from 'src/application/repositories/logs-repository';
import { UsersRepository } from 'src/application/repositories/user-repository';
import { DateService } from '../dates/date.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaCityCouncilsRepository } from './prisma/repositories/prisma-city-council-repository';
import { PrismaLegislativeMattersRepository } from './prisma/repositories/prisma-legislative-matter';
import { PrismaLogsRepository } from './prisma/repositories/prisma-logs-repository';
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository';
import { PrismaOfficesRepository } from './prisma/repositories/prisma-office-repository';
import { PrismaOrderDaysRepository } from './prisma/repositories/prisma-order-day-repository';
import { PrismaSessionsRepository } from './prisma/repositories/prisma-sessions-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-user-repository';

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
    {
      provide: LegislativeMattersRepository,
      useClass: PrismaLegislativeMattersRepository,
    },
    {
      provide: OfficesRepository,
      useClass: PrismaOfficesRepository,
    },
    {
      provide: OrderDaysRepository,
      useClass: PrismaOrderDaysRepository,
    },
    {
      provide: SessionsRepository,
      useClass: PrismaSessionsRepository,
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
    {
      provide: LegislativeMattersRepository,
      useClass: PrismaLegislativeMattersRepository,
    },
    {
      provide: OfficesRepository,
      useClass: PrismaOfficesRepository,
    },
    {
      provide: OrderDaysRepository,
      useClass: PrismaOrderDaysRepository,
    },
    {
      provide: SessionsRepository,
      useClass: PrismaSessionsRepository,
    },
    PrismaService,
  ],
})
export class DatabaseModule {}
