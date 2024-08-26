import { Encrypter } from '@/application/cryptography/encrypter';
import { HashGenerator } from '@/application/cryptography/hash-generator';
import { EMAIL_QUEUE } from '@/common/constants';
import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from './../../entities/user';

interface UserRequest {
  requestOwnerId: string;
  name: string;
  email: string;
}

interface UserResponse {
  user: User;
}

@Injectable()
export class CreateUserAdmin {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter,
    @InjectQueue(EMAIL_QUEUE) private sendMailQueue: Queue,
  ) {}

  async execute(request: UserRequest): Promise<UserResponse> {
    const { email, name, requestOwnerId } = request;

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new BadRequestException(`Usuário com email ${email} já existe`, {
        cause: new Error(`Usuário com email ${email} já existe`),
        description: `Usuário com email ${email} já existe`,
      });
    }

    const requestOwner = await this.usersRepository.findById(requestOwnerId);

    if (!requestOwner) {
      throw new BadRequestException('Não foi possivel definir responsável', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    if (requestOwner.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'Usuário não tem permissão para executar essa ação',
      );
    }

    const temporaryPassword = randomUUID().substring(2, 8);

    const hashedPassword = await this.hashGenerator.hash(temporaryPassword);

    const user = User.create({
      name,
      email,
      role: 'ADMIN',
      password: hashedPassword,
    });

    await this.usersRepository.create(user);

    const expiresIn = '10m';
    const token = await this.encrypter.encrypt(
      { id: user.id, email },
      expiresIn,
    );

    await this.sendMailQueue.add('sendMail-job', {
      email: email,
      subject: 'Redefinição de senha',
      templateName: 'redefine-temporary-password.hbs',
      context: {
        projectName: 'sysdelta',
        name,
        resetUrl: `${process.env.FRONTEND_URL}/recovery-password/redefine?token=${token}`,
        temporaryPassword,
      },
    });

    return { user };
  }
}
