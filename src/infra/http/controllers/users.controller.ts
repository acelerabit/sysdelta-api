import { CreateUser } from './../../../application/use-cases/user/create-user';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserBody } from '../dtos/create-user-body';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('users')
export class UsersController {
  constructor(
    private createUser: CreateUser,
    @InjectQueue('sendMail-queue') private sendMailQueue: Queue,
  ) {}

  @Post()
  async create(@Body() body: CreateUserBody) {
    const { email, password, role, name } = body;

    const { user } = await this.createUser.execute({
      name,
      email,
      password,
      role,
    });

    return { user };
  }

  @Get()
  async sendMail() {
    await this.sendMailQueue.add('sendMail-job', { email: 'teste@gmail.com' });

    return;
  }
}
