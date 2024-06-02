import { HashGenerator } from '@/application/cryptography/hash-generator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from './../../entities/user';
import { BillingService } from '@/infra/billing/billing.service';

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
    private billingService: BillingService,
  ) {}

  async execute(request: UserRequest): Promise<UserResponse> {
    const { email, password, name, role } = request;

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new BadRequestException(`Usuário com email ${email} já existe`, {
        cause: new Error(`Usuário com email ${email} já existe`),
        description: `Usuário com email ${email} já existe`,
      });
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      email,
      role,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const customer = await this.billingService.createCustomer({
      name: user.name,
      email: user.email,
    });

    user.externalId = customer.id;

    await this.usersRepository.create(user);

    return { user };
  }
}
