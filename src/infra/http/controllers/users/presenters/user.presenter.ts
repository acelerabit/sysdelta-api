import { User } from '@/application/entities/user';

export class UsersPresenters {
  static toHTTP(user: User) {
    return {
      email: user.email,
      name: user.name,
      role: user.role,
      id: user.id,
      avatarUrl: user.avatarUrl,
      acceptNotifications: user.acceptNotifications,
      phone: user.phone,
      cpf: user.cpf,
      politicalParty: user.politicalParty,
      createdAt: user.createdAt,
      affiliatedCouncil: user.affiliatedCouncil
        ? {
            name: user.affiliatedCouncil.name,
            id: user.affiliatedCouncil.id,
          }
        : null,
    };
  }
}
