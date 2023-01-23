import { HttpModule } from './infra/http/http.module';
import { DatabaseModule } from './infra/database/database.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
