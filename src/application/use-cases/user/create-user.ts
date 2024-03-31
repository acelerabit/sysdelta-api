import { HashGenerator } from '@/application/cryptography/hash-generator';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from './../../entities/user';

interface UserRequest {
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  password: string;
}

interface UserResponse {
  user: User;
}

@Injectable()
export class CreateUser {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(request: UserRequest): Promise<UserResponse> {
    const { email, password, name, role } = request;

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      email,
      role,
      password: hashedPassword,
      createdAt: new Date(),
    });

    await this.usersRepository.create(user);

    return { user };
  }
}
