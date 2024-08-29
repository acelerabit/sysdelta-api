import { HashGenerator } from '@/application/cryptography/hash-generator';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from './../../entities/user';
import { CityCouncilsRepository } from '@/application/repositories/city-council-repository';
import { randomUUID } from 'crypto';
import { InjectQueue } from '@nestjs/bull';
import { EMAIL_QUEUE } from '@/common/constants';
import { Queue } from 'bull';
import { Encrypter } from '@/application/cryptography/encrypter';

interface UserRequest {
  requestOwnerId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'PRESIDENT' | 'COUNCILOR' | 'SECRETARY' | 'ASSISTANT';
  cityCouncilId: string;
  cpf: string;
  phone: string;
  politicalParty: string;
}

interface UserResponse {
  user: User;
}

@Injectable()
export class CreateUser {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter,
    private cityCouncilsRepository: CityCouncilsRepository,
    @InjectQueue(EMAIL_QUEUE) private sendMailQueue: Queue,
  ) {}

  async execute(request: UserRequest): Promise<UserResponse> {
    const {
      email,
      name,
      role,
      cityCouncilId,
      requestOwnerId,
      cpf,
      phone,
      politicalParty,
    } = request;

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new BadRequestException(`Usuário com email ${email} já existe`, {
        cause: new Error(`Usuário com email ${email} já existe`),
        description: `Usuário com email ${email} já existe`,
      });
    }

    const userWithSamePhone = await this.usersRepository.findByPhone(phone);

    if (userWithSamePhone) {
      throw new BadRequestException(`Usuário com telefone já existe`, {
        cause: new Error(`Usuário com telefone já existe`),
        description: `Usuário com telefone já existe`,
      });
    }

    const userWithSameCpf = await this.usersRepository.findByCpf(cpf);

    if (userWithSameCpf) {
      throw new BadRequestException(`Usuário com esse CPF já existe`, {
        cause: new Error(`Usuário com esse CPF já existe`),
        description: `Usuário com esse CPF já existe`,
      });
    }

    const cityCouncil = await this.cityCouncilsRepository.findById(
      cityCouncilId,
    );

    if (!cityCouncil) {
      throw new BadRequestException('Não foi possivel encontrar a câmara', {
        cause: new Error('Câmara não encontrada'),
        description: 'Câmara não encontrada',
      });
    }

    const requestOwner = await this.usersRepository.findById(requestOwnerId);

    if (!requestOwner) {
      throw new BadRequestException('Não foi possivel definir responsável', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    if (
      requestOwner.role === 'COUNCILOR' ||
      requestOwner.role === 'SECRETARY'
    ) {
      throw new UnauthorizedException(
        'Usuário não tem permissão para executar essa ação',
      );
    }

    if (requestOwner.role === 'ASSISTANT' && role !== 'COUNCILOR') {
      throw new UnauthorizedException(
        'Usuário auxiliar não tem permissão para criar usuários desse tipo',
      );
    }

    const temporaryPassword = randomUUID().substring(2, 8);

    const hashedPassword = await this.hashGenerator.hash(temporaryPassword);

    const user = User.create({
      name,
      email,
      role,
      password: hashedPassword,
      createdAt: new Date(),
      affiliatedCouncilId: cityCouncil.id,
      cpf,
      phone,
      politicalParty,
    });

    await this.usersRepository.create(user);

    const expiresIn = '10m';
    const token = await this.encrypter.encrypt(
      { id: user.id, email },
      expiresIn,
    );

    this.sendMailQueue.add('sendMail-job', {
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
