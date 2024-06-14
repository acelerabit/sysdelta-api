import { User } from 'src/application/entities/user';
import { Prisma } from '@prisma/client';

export class PrismaUsersMapper {
  static toDomain(user: any) {
    return User.create(
      {
        email: user.email,
        name: user.name,
        role: user.role,
        password: user.password,
        avatarUrl: user.avatarUrl,
        acceptNotifications: user.acceptNotifications,
        externalId: user.externalId,
        createdAt: user.createdAt,
        subscriptionId: user?.subscription?.id ?? null,
      },
      user.id,
    );
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
      externalId: user.externalId,
      createdAt: user.createdAt,
    };
  }
}
