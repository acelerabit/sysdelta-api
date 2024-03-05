import { User as UserEntity } from 'src/application/entities/user';
import { Prisma, User as UserType } from '@prisma/client';

/*

use when you nedd include relations

type UserType = Prisma.PaymentGetPayload<{
  include: {
    ...
  }
}>;

*/

export function findUserMapper(raw: UserType) {
  const user = new UserEntity(
    {
      name: raw.name,
      email: raw.email,
      role: raw.role,
      password: raw.password,
      createdAt: raw.createdAt,
    },
    raw.id,
  );

  return user;
}

export function findManyUsersMapper(users: UserType[]) {
  return users.map((user) => {
    return new UserEntity(
      {
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.password,
        createdAt: user.createdAt,
      },
      user.id,
    );
  });
}

export function toEntity(raw: any) {
  const user = new UserEntity(
    {
      name: raw.name,
      email: raw.email,
      role: raw.role,
      password: raw.password,
      createdAt: raw.createdAt,
    },
    raw.id,
  );

  return user;
}
