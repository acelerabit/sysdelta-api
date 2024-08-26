import { CityCouncil } from '@/application/entities/city-council';

export class CityCouncilsPresenters {
  static toHTTP(cityCouncil: CityCouncil) {
    return {
      id: cityCouncil.id,
      name: cityCouncil.name,
      cnpj: cityCouncil.cnpj,
      city: cityCouncil.city,
      state: cityCouncil.state,
      responsible: cityCouncil.responsible
        ? {
            name: cityCouncil.responsible.name,
            email: cityCouncil.responsible.email,
            id: cityCouncil.responsible.id,
          }
        : null,
    };
  }
}
