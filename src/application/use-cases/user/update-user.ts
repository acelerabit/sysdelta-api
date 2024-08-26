import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/application/entities/user';
import { UsersRepository } from 'src/application/repositories/user-repository';

export interface UpdateUserRequest {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  politicalParty: string;
  acceptNotifications: boolean;
  role: 'ADMIN' | 'SECRETARY' | 'COUNCILOR' | 'ASSISTANT' | 'PRESIDENT';
}

export interface UpdateUserResponse {
  user: User;
}

@Injectable()
export class UpdateUser {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    email,
    name,
    acceptNotifications,
    cpf,
    politicalParty,
    phone,
    role,
  }: UpdateUserRequest): Promise<UpdateUserResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new BadRequestException('Não foi possivel editar o usuário', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    const updates: Partial<User> = {};

    if (email) {
      updates.email = email;
    }

    if (name) {
      updates.name = name;
    }

    if (cpf) {
      updates.cpf = cpf;
    }

    if (phone) {
      updates.phone = phone;
    }

    if (role) {
      updates.role = role;
    }

    if (politicalParty) {
      updates.politicalParty = politicalParty;
    }

    if (typeof acceptNotifications === 'boolean') {
      updates.acceptNotifications = acceptNotifications;
    }

    Object.assign(user, updates);

    await this.usersRepository.update(user);

    return { user };
  }
}
