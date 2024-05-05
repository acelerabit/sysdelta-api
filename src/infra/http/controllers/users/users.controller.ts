import { UpdateUser } from '@/application/use-cases/user/update-user';
import { EMAIL_QUEUE } from '@/common/constants';
import { InjectQueue } from '@nestjs/bull';
import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateUser } from 'src/application/use-cases/user/create-user';
import { JwtUserAuthGuard } from 'src/infra/auth/jwt.guard';
import { CreateUserBody } from './dtos/create-user-body';
import { UpdateUserBody } from './dtos/update-user-body';
import { ScheduleService } from '@/infra/schedules/schedules.service';

/** If you want catch data from requests and responses, enable it */

// const interceptor = new LoggingInterceptor(new LoggingService(), [
//   'password',
//   'access_token',
//   'user.email',
// ]);

@Controller('users')
export class UsersController {
  constructor(
    private createUser: CreateUser,
    private updateUser: UpdateUser,
    private scheduleService: ScheduleService,
    @InjectQueue(EMAIL_QUEUE) private sendMailQueue: Queue,
  ) {}

  // @UseInterceptors(interceptor)
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
      id: user.id,
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
  @Get('/send-email')
  async sendMail() {
    await this.sendMailQueue.add('sendMail-job', { email: 'teste@gmail.com' });

    return;
  }
}
