import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './infra/auth/auth.module';
import { DatabaseModule } from './infra/database/database.module';
import { DateModule } from './infra/dates/date.module';
import { HttpModule } from './infra/http/http.module';
import { SchedulesModule } from './infra/schedules/schedules.module';
import { CurrentUserMiddleware } from './infra/middlewares/middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    HttpModule,
    AuthModule,
    DateModule,
    SchedulesModule,
  ],
  controllers: [],
  providers: [JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
