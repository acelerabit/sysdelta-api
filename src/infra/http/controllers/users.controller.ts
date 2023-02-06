import { CreateUser } from './../../../application/use-cases/user/create-user';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserBody } from '../dtos/create-user-body';

@Controller('users')
export class UsersController {
  constructor(private createUser: CreateUser) {}

  @Post()
  async create(@Body() body: CreateUserBody) {
    const { email } = body;

    const { user } = await this.createUser.execute({
      email,
    });

    return { user };
  }
}
