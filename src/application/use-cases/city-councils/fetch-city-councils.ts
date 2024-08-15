import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/@shared/pagination-interface';
import { CityCouncil } from '@/application/entities/city-council';
import { CityCouncilsRepository } from '@/application/repositories/city-council-repository';

interface CityCouncilRequest {
  pagination: PaginationParams;
}

interface CityCouncilResponse {
  cityCouncils: CityCouncil[];
}

@Injectable()
export class FetchCityCouncils {
  constructor(private cityCouncilsRepository: CityCouncilsRepository) {}

  async execute({
    pagination,
  }: CityCouncilRequest): Promise<CityCouncilResponse> {
    const cityCouncils = await this.cityCouncilsRepository.findAll(pagination);

    return { cityCouncils };
  }
}
