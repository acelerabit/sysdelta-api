import { HttpModule } from './infra/http/http.module';
import { DatabaseModule } from './infra/database/database.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './infra/auth/auth.module';
import { LoggingService } from './infra/services/logging.service';

@Module({
  imports: [DatabaseModule, HttpModule, AuthModule],
  controllers: [],
  providers: [LoggingService],
})
export class AppModule {}
