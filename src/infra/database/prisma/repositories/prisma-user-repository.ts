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
        cpf: user.cpf,
        phone: user.phone,
        politicalParty: user.politicalParty,
        affiliatedCouncilId: user.affiliatedCouncilId ?? null,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    const raw = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        affiliatedCouncil: true,
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaUsersMapper.toDomain(raw);
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const raw = await this.prismaService.user.findUnique({
      where: {
        cpf,
      },
      include: {
        affiliatedCouncil: true,
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaUsersMapper.toDomain(raw);
  }

  async findByPhone(phone: string): Promise<User | null> {
    const raw = await this.prismaService.user.findUnique({
      where: {
        phone,
      },
      include: {
        affiliatedCouncil: true,
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
      include: {
        responsible: {
          include: {
            user: true,
          },
        },
      },
    });

    return users.map(PrismaUsersMapper.toDomain);
  }

  async findManyAdmin(pagination: PaginationParams): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      where: {
        role: 'ADMIN',
      },
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

  async findAllByCityCouncil(cityCouncilId: string): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      where: {
        affiliatedCouncilId: cityCouncilId,
      },
    });

    return users.map(PrismaUsersMapper.toDomain);
  }

  async findManyByCityCouncil({
    cityCouncilId,
    name,
    email,
    orderByField,
    orderDirection,
    filterParams,
    pagination,
  }: {
    cityCouncilId: string;
    pagination: PaginationParams;
    name?: string;
    email?: string;
    orderByField?: 'name' | 'email' | 'createdAt' | 'role';
    orderDirection?: 'desc' | 'asc';
    filterParams?: {
      role: 'ADMIN' | 'PRESIDENT' | 'SECRETARY' | 'COUNCILOR' | 'ASSISTANT';
      startDate: Date;
      endDate: Date;
    };
  }): Promise<User[]> {
    const orderBy = {};
    orderBy[orderByField] = orderDirection;
    let whereFilter = {};

    if (filterParams) {
      if (filterParams.role) {
        whereFilter = { ...whereFilter, role: filterParams.role };
      }

      if (filterParams.startDate && filterParams.endDate) {
        whereFilter = {
          ...whereFilter,
          createdAt: {
            gte: new Date(filterParams.startDate),
            lte: new Date(filterParams.endDate),
          },
        };
      }
    }

    if (name || email) {
      const raw = await this.prismaService.user.findMany({
        ...(pagination?.itemsPerPage ? { take: pagination.itemsPerPage } : {}),
        ...(pagination?.page
          ? { skip: (pagination.page - 1) * pagination.itemsPerPage }
          : {}),
        where: {
          affiliatedCouncilId: cityCouncilId,

          OR: [
            {
              email: email
                ? {
                    contains: email,
                  }
                : {},
            },
            {
              name: name
                ? {
                    contains: name,
                  }
                : {},
            },
          ],
          ...whereFilter,
        },
        orderBy: orderBy,
      });

      return raw.map(PrismaUsersMapper.toDomain);
    }

    const users = await this.prismaService.user.findMany({
      where: {
        affiliatedCouncilId: cityCouncilId,
        ...whereFilter,
      },
      take: pagination.itemsPerPage,
      skip: (pagination.page - 1) * pagination.itemsPerPage,
      orderBy,
    });

    return users.map(PrismaUsersMapper.toDomain);
  }

  async findById(id: string): Promise<User> {
    const raw = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        affiliatedCouncil: true,
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

  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });

    return;
  }
}
