import { HttpModule } from './infra/http/http.module';
import { DatabaseModule } from './infra/database/database.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './infra/auth/auth.module';
import { LoggingService } from './infra/services/logging.service';
import { DateModule } from './infra/dates/date.module';
import { SchedulesModule } from './infra/schedules/schedules.module';

@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    AuthModule,
    DateModule,
    SchedulesModule,
  ],
  controllers: [],
  providers: [LoggingService],
})
export class AppModule {}
