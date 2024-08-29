import { CityCouncil } from '@/application/entities/city-council';
import { CityCouncilsRepository } from '@/application/repositories/city-council-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface CityCouncilRequest {
  id: string;
}

@Injectable()
export class DeleteCityCouncil {
  constructor(private cityCouncilsRepository: CityCouncilsRepository) {}

  async execute({ id }: CityCouncilRequest): Promise<void> {
    const cityCouncil = await this.cityCouncilsRepository.findById(id);

    if (!cityCouncil) {
      throw new BadRequestException('Não foi possivel buscar a câmara', {
        cause: new Error('Câmara não encontrada'),
        description: 'Câmara não encontrada',
      });
    }

    await this.cityCouncilsRepository.delete(id);

    return;
  }
}
