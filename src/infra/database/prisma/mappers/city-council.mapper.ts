import { CityCouncil } from '@/application/entities/city-council';
import { User } from '@/application/entities/user';

export class PrismaCityCouncilsMapper {
  static toDomain(cityCouncil: any) {
    const cityCouncilResult = CityCouncil.create(
      {
        councilMembers: cityCouncil.councilMembers,
        name: cityCouncil.name,
        responsible: cityCouncil.responsible,
        city: cityCouncil.city,
        state: cityCouncil.state,
        cnpj: cityCouncil.cnpj,
        active: cityCouncil.active,
      },
      cityCouncil.id,
    );

    if (cityCouncil.responsible) {
      const responsible = User.create(
        {
          email: cityCouncil.responsible.user.email,
          name: cityCouncil.responsible.user.name,
          role: cityCouncil.responsible.user.role,
        },
        cityCouncil.responsible.user.id,
      );

      cityCouncilResult.responsible = responsible;
    }

    return cityCouncilResult;
  }

  static toPrisma(cityCouncil: CityCouncil) {
    return {
      name: cityCouncil.name,
      city: cityCouncil.city,
      state: cityCouncil.state,
      cnpj: cityCouncil.cnpj,
      active: cityCouncil.active,
      responsible: cityCouncil.responsible.id,
      id: cityCouncil.id,
    };
  }
}
