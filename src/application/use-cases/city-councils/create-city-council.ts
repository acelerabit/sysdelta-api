import { CityCouncil } from '@/application/entities/city-council';
import { CityCouncilsRepository } from '@/application/repositories/city-council-repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';

interface UserRequest {
  name: string;
  userId: string;
}

interface UserResponse {
  cityCouncil: CityCouncil;
}

@Injectable()
export class CreateCityCouncil {
  constructor(
    private usersRepository: UsersRepository,
    private cityCouncilRepository: CityCouncilsRepository,
  ) {}

  async execute(request: UserRequest): Promise<UserResponse> {
    const { userId, name } = request;

    const user = await this.usersRepository.findById(userId);

    if (user) {
      throw new BadRequestException(`Usuário não encontrado`, {
        cause: new Error(`Usuário não encontrado`),
        description: `Usuário não encontrado`,
      });
    }

    if (user.role !== 'ADMIN') {
      throw new BadRequestException(
        `Usuário não tem permissão para esse tipo de ação`,
        {
          cause: new Error(`Usuário não tem permissão para esse tipo de ação`),
          description: `Usuário não tem permissão para esse tipo de ação`,
        },
      );
    }

    const cityCouncil = CityCouncil.create({
      name,
    });

    await this.cityCouncilRepository.create(cityCouncil);

    return { cityCouncil };
  }
}
