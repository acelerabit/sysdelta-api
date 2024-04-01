import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Queue } from 'bull';
import { LoggingInterceptor } from 'src/infra/interceptors/logging.interceptor';
import { LoggingService } from 'src/infra/services/logging.service';
import { JwtUserAuthGuard } from 'src/infra/auth/jwt.guard';
import { CreateUser } from 'src/application/use-cases/user/create-user';
import { CreateUserBody } from './dtos/create-user-body';
import { UpdateUser } from '@/application/use-cases/user/update-user';
import { UpdateUserBody } from './dtos/update-user-body';

const interceptor = new LoggingInterceptor(new LoggingService(), [
  'password',
  'access_token',
  'user.email',
]);

@Controller('users')
export class UsersController {
  constructor(
    private createUser: CreateUser,
    private updateUser: UpdateUser,
    @InjectQueue('sendMail-queue') private sendMailQueue: Queue,
  ) {}

  @UseInterceptors(interceptor)
  @Post()
  async create(@Body() body: CreateUserBody) {
    const { email, password, role, name } = body;

    const { user } = await this.createUser.execute({
      name,
      email,
      password,
      role,
    });

    return {
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  @Put()
  async update(@Body() body: UpdateUserBody) {
    const { email, id, role, name } = body;

    const { user } = await this.updateUser.execute({
      name,
      email,
      role,
      id,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  @UseGuards(JwtUserAuthGuard)
  @UseInterceptors(interceptor)
  @Get('/send-email')
  async sendMail() {
    await this.sendMailQueue.add('sendMail-job', { email: 'teste@gmail.com' });

    return;
  }
}
