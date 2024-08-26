import { CityCouncil } from '@/application/entities/city-council';
import { CityCouncilsRepository } from '@/application/repositories/city-council-repository';
import { UsersRepository } from '@/application/repositories/user-repository';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

export interface AssignResponsibleToCityCouncilRequest {
  userId: string;
  responsibleId: string;
  cityCouncilId: string;
}

export interface AssignResponsibleToCityCouncilResponse {
  cityCouncil: CityCouncil;
}

@Injectable()
export class AssignResponsibleToCityCouncil {
  constructor(
    private cityCouncilsRepository: CityCouncilsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    responsibleId,
    cityCouncilId,
  }: AssignResponsibleToCityCouncilRequest): Promise<AssignResponsibleToCityCouncilResponse> {
    const cityCouncil = await this.cityCouncilsRepository.findById(
      cityCouncilId,
    );

    if (!cityCouncil) {
      throw new BadRequestException('Não foi possivel editar a câmara', {
        cause: new Error('Câmara não encontrada'),
        description: 'Câmara não encontrada',
      });
    }

    const admin = await this.usersRepository.findById(userId);

    if (!admin) {
      throw new BadRequestException('Não foi possivel definir responsável', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    if (admin.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'Usuário não tem permissão para executar essa ação',
      );
    }

    const newResponsible = await this.usersRepository.findById(responsibleId);

    if (!newResponsible) {
      throw new BadRequestException('Não foi possivel definir responsável', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    if (newResponsible.affiliatedCouncilId !== cityCouncilId) {
      throw new BadRequestException('Esse usuário não pertence a essa câmara', {
        cause: new Error('Esse usuário não pertence a essa câmara'),
        description: 'Esse usuário não pertence a essa câmara',
      });
    }

    if (newResponsible.role !== 'PRESIDENT') {
      throw new BadRequestException(
        'Somentes Presidentes podem ser responsáveis pela câmara',
        {
          cause: new Error(
            'Somentes Presidentes podem ser responsáveis pela câmara',
          ),
          description:
            'Somentes Presidentes podem ser responsáveis pela câmara',
        },
      );
    }

    cityCouncil.responsible = newResponsible;

    await this.cityCouncilsRepository.assignResponsible(cityCouncil);

    return { cityCouncil };
  }
}
