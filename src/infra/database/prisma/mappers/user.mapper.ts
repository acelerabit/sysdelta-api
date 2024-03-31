import { User } from 'src/application/entities/user';
import { Prisma, User as PrismaUser } from '@prisma/client';

export class PrismaUsersMapper {
  static toDomain(user: PrismaUser) {
    return User.create(
      {
        email: user.email,
        name: user.name,
        role: user.role,
        password: user.password,
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
    };
  }
}
