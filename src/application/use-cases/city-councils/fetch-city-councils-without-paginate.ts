import { Injectable } from '@nestjs/common';

import { CityCouncil } from '@/application/entities/city-council';
import { CityCouncilsRepository } from '@/application/repositories/city-council-repository';

interface CityCouncilResponse {
  cityCouncils: CityCouncil[];
}

@Injectable()
export class FetchCityCouncilsWithoutPaginate {
  constructor(private cityCouncilsRepository: CityCouncilsRepository) {}

  async execute(): Promise<CityCouncilResponse> {
    const cityCouncils =
      await this.cityCouncilsRepository.findAllWithoutPaginate();

    return { cityCouncils };
  }
}
