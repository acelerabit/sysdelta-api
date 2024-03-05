import { Injectable } from '@nestjs/common';
import { User } from 'src/application/entities/user';
import { UsersRepository } from 'src/application/repositories/user-repository';
import { PrismaService } from '../prisma.service';
import { toEntity } from '../mappers/user.mapper';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prismaService: PrismaService) {}

  async create(user: User): Promise<void> {
    await this.prismaService.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        role: user.role,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    const raw = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!raw) {
      return null;
    }

    return toEntity(raw);
  }
}
