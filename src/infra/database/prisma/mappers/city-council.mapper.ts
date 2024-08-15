import { CityCouncil } from '@/application/entities/city-council';

export class PrismaCityCouncilsMapper {
  static toDomain(cityCouncil: any) {
    return CityCouncil.create(
      {
        councilMembers: cityCouncil.councilMembers,
        name: cityCouncil.name,
        responsible: cityCouncil.responsible,
      },
      cityCouncil.id,
    );
  }

  static toPrisma(cityCouncil: CityCouncil) {
    return {
      name: cityCouncil.name,
      responsible: cityCouncil.responsible.id,
      id: cityCouncil.id,
    };
  }
}
