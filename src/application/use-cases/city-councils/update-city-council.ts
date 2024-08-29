import { CityCouncil } from '@/application/entities/city-council';
import { CityCouncilsRepository } from '@/application/repositories/city-council-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

export interface UpdateCityCouncilRequest {
  cityCouncilId: string;
  name: string;
  city: string;
  state: string;
  cnpj: string;
}

export interface UpdateCityCouncilResponse {
  cityCouncil: CityCouncil;
}

@Injectable()
export class UpdateCityCouncil {
  constructor(private cityCouncilsRepository: CityCouncilsRepository) {}

  async execute({
    cityCouncilId,
    name,
    city,
    state,
    cnpj,
  }: UpdateCityCouncilRequest): Promise<UpdateCityCouncilResponse> {
    const cityCouncil = await this.cityCouncilsRepository.findById(
      cityCouncilId,
    );

    if (!cityCouncil) {
      throw new BadRequestException('Não foi possivel editar a câmara', {
        cause: new Error('Câmara não encontrada'),
        description: 'Câmara não encontrada',
      });
    }

    const updates: Partial<CityCouncil> = {};

    if (name) {
      updates.name = name;
    }

    if (city) {
      updates.city = city;
    }

    if (state) {
      updates.state = state;
    }

    if (cnpj) {
      updates.cnpj = cnpj;
    }

    Object.assign(cityCouncil, updates);

    await this.cityCouncilsRepository.update(cityCouncil);

    return { cityCouncil };
  }
}
