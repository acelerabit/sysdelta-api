import { CityCouncil } from '@/application/entities/city-council';

export class CityCouncilsPresenters {
  static toHTTP(cityCouncil: CityCouncil) {
    return {
      name: cityCouncil.name,
      responsible: {
        name: cityCouncil.responsible.name,
        email: cityCouncil.responsible.email,
      },
    };
  }
}
