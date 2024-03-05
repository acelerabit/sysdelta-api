import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersController } from './controllers/users.controller';
import { CreateUser } from 'src/application/use-cases/user/create-user';
import { AuthController } from './controllers/auth.controller';
import { LoginUser } from 'src/application/use-cases/authenticate/login-user';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController, AuthController],
  providers: [CreateUser, LoginUser, JwtService],
  imports: [DatabaseModule],
})
export class HttpModule {}
