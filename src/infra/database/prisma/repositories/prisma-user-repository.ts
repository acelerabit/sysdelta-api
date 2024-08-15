import { Injectable } from '@nestjs/common';
import { User } from 'src/application/entities/user';
import { UsersRepository } from 'src/application/repositories/user-repository';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@/@shared/pagination-interface';
import { PrismaUsersMapper } from '../mappers/user.mapper';

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
        acceptNotifications: user.acceptNotifications,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    const raw = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaUsersMapper.toDomain(raw);
  }

  async findAll(pagination: PaginationParams): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      take: pagination.itemsPerPage,
      skip: (pagination.page - 1) * pagination.itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map(PrismaUsersMapper.toDomain);
  }

  async findAllWithoutPaginate(): Promise<User[]> {
    const users = await this.prismaService.user.findMany();

    return users.map(PrismaUsersMapper.toDomain);
  }

  async findById(id: string): Promise<User> {
    const raw = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaUsersMapper.toDomain(raw);
  }

  async update(user: User): Promise<void> {
    const prismaUser = PrismaUsersMapper.toPrisma(user);

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: prismaUser,
    });
  }

  async count(): Promise<number> {
    const count = await this.prismaService.user.count();

    return count;
  }
}
