import { User } from 'src/application/entities/user';
import { Prisma } from '@prisma/client';
import { CityCouncil } from '@/application/entities/city-council';

export class PrismaUsersMapper {
  static toDomain(user: any) {
    const toDomainUser = User.create(
      {
        email: user.email,
        name: user.name,
        role: user.role,
        password: user.password,
        avatarUrl: user.avatarUrl,
        acceptNotifications: user.acceptNotifications,
        createdAt: user.createdAt,
        active: user.active,
        affiliatedCouncilId: user.affiliatedCouncilId,
        cpf: user.cpf,
        phone: user.phone,
        politicalParty: user.politicalParty,
      },
      user.id,
    );

    if (user.affiliatedCouncil) {
      const cityCouncil = CityCouncil.create(
        {
          city: user.affiliatedCouncil.city,
          state: user.affiliatedCouncil.state,
          cnpj: user.affiliatedCouncil.cnpj,
          name: user.affiliatedCouncil.name,
        },
        user.affiliatedCouncil.id,
      );

      toDomainUser.affiliatedCouncil = cityCouncil;

      return toDomainUser;
    }

    return toDomainUser;
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      email: user.email,
      name: user.name,
      password: user.password,
      id: user.id,
      role: user.role,
      avatarUrl: user.avatarUrl,
      acceptNotifications: user.acceptNotifications,
      createdAt: user.createdAt,
      active: user.active,
      affiliatedCouncilId: user.affiliatedCouncilId,
      cpf: user.cpf,
      phone: user.phone,
      politicalParty: user.politicalParty,
    };
  }
}
