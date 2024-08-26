import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@/@shared/pagination-interface';
import { PrismaCityCouncilsMapper } from '../mappers/city-council.mapper';
import { CityCouncil } from '@/application/entities/city-council';
import { CityCouncilsRepository } from '@/application/repositories/city-council-repository';

@Injectable()
export class PrismaCityCouncilsRepository implements CityCouncilsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(cityCouncil: CityCouncil): Promise<void> {
    await this.prismaService.cityCouncil.create({
      data: {
        id: cityCouncil.id,
        name: cityCouncil.name,
        city: cityCouncil.city,
        state: cityCouncil.state,
        cnpj: cityCouncil.cnpj,
        active: cityCouncil.active,
      },
    });
  }

  async findByName(name: string): Promise<CityCouncil> {
    const raw = await this.prismaService.cityCouncil.findFirst({
      where: {
        name,
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaCityCouncilsMapper.toDomain(raw);
  }

  async findAll(pagination: PaginationParams): Promise<CityCouncil[]> {
    const cityCouncils = await this.prismaService.cityCouncil.findMany({
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

    return cityCouncils.map(PrismaCityCouncilsMapper.toDomain);
  }

  async findAllWithoutPaginate(): Promise<CityCouncil[]> {
    const cityCouncils = await this.prismaService.cityCouncil.findMany();

    return cityCouncils.map(PrismaCityCouncilsMapper.toDomain);
  }

  async findById(id: string): Promise<CityCouncil> {
    const raw = await this.prismaService.cityCouncil.findUnique({
      where: {
        id,
      },
      include: {
        responsible: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaCityCouncilsMapper.toDomain(raw);
  }

  async assignResponsible(cityCouncil: CityCouncil): Promise<void> {
    const prismaCityCouncil = PrismaCityCouncilsMapper.toPrisma(cityCouncil);

    const cityCouncilFound = await this.prismaService.cityCouncil.findUnique({
      where: {
        id: cityCouncil.id,
      },
      include: {
        responsible: true,
      },
    });

    if (cityCouncilFound.responsible) {
      await this.prismaService.responsible.update({
        where: {
          id: cityCouncilFound.responsible.id,
        },
        data: {
          userId: cityCouncil.responsible.id,
        },
      });

      return;
    }

    await this.prismaService.responsible.create({
      data: {
        userId: prismaCityCouncil.responsible,
        cityCouncilId: cityCouncil.id,
      },
    });

    return;
  }

  async update(cityCouncil: CityCouncil): Promise<void> {
    const prismaCityCouncil = PrismaCityCouncilsMapper.toPrisma(cityCouncil);

    await this.prismaService.cityCouncil.update({
      where: {
        id: cityCouncil.id,
      },
      data: {
        name: prismaCityCouncil.name,
        city: prismaCityCouncil.city,
        state: prismaCityCouncil.state,
        cnpj: prismaCityCouncil.cnpj,
        active: prismaCityCouncil.active,
      },
    });
  }

  async count(): Promise<number> {
    const count = await this.prismaService.cityCouncil.count();

    return count;
  }
}
