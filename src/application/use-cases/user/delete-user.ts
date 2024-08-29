import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';

interface UserRequest {
  id: string;
}

@Injectable()
export class DeleteUser {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: UserRequest): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new BadRequestException('Não foi possivel buscar o usuário', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    await this.usersRepository.delete(user.id);

    return;
  }
}
