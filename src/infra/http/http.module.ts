import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CreateUser } from 'src/application/use-cases/user/create-user';
import { LoginUser } from 'src/application/use-cases/authenticate/login-user';
import { JwtService } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module';
import { FetchAllLogs } from 'src/application/use-cases/logs/fetch-all-logs';
import { LogsController } from './controllers/logs/logs.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { UsersController } from './controllers/users/users.controller';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { UpdateUser } from '@/application/use-cases/user/update-user';
import { LoggingService } from '../services/logging.service';

@Module({
  controllers: [UsersController, AuthController, LogsController],
  providers: [
    CreateUser,
    LoginUser,
    FetchAllLogs,
    UpdateUser,
    JwtService,
    LoggingService,
  ],
  imports: [DatabaseModule, EmailModule, CryptographyModule],
})
export class HttpModule {}
