import { CityCouncil } from '@/application/entities/city-council';
import { CityCouncilsRepository } from '@/application/repositories/city-council-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface CityCouncilRequest {
  id: string;
}

interface CityCouncilResponse {
  cityCouncil: CityCouncil;
}

@Injectable()
export class GetCityCouncil {
  constructor(private cityCouncilsRepository: CityCouncilsRepository) {}

  async execute({ id }: CityCouncilRequest): Promise<CityCouncilResponse> {
    const cityCouncil = await this.cityCouncilsRepository.findById(id);

    if (!cityCouncil) {
      throw new BadRequestException('Não foi possivel buscar a câmara', {
        cause: new Error('Câmara não encontrada'),
        description: 'Câmara não encontrada',
      });
    }

    return { cityCouncil };
  }
}
