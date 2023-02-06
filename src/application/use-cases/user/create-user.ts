import { UsersRepository } from '../../repositories/user-repository';
import { User } from './../../entities/user';
import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

interface UserRequest {
  email: string;
  password: string;
}

interface UserResponse {
  user: User;
}

@Injectable()
export class CreateUser {
  constructor(private usersRepository: UsersRepository) {}

  async execute(request: UserRequest): Promise<UserResponse> {
    const { email, password } = request;

    const hashedPassword = await this.hashPassword(password);

    const user = new User({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    await this.usersRepository.create(user);

    return { user };
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }
}
