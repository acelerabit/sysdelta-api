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
      // orderBy: {
      //   createdAt: 'desc',
      // },
    });

    return cityCouncils.map(PrismaCityCouncilsMapper.toDomain);
  }

  async findById(id: string): Promise<CityCouncil> {
    const raw = await this.prismaService.cityCouncil.findUnique({
      where: {
        id,
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaCityCouncilsMapper.toDomain(raw);
  }

  async update(cityCouncil: CityCouncil): Promise<void> {
    const prismaCityCouncil = PrismaCityCouncilsMapper.toPrisma(cityCouncil);

    await this.prismaService.cityCouncil.update({
      where: {
        id: cityCouncil.id,
      },
      data: {
        name: prismaCityCouncil.name,
        responsible: {
          connect: {
            userId: prismaCityCouncil.responsible,
            cityCouncilId: prismaCityCouncil.id,
          },
        },
      },
    });
  }

  async count(): Promise<number> {
    const count = await this.prismaService.cityCouncil.count();

    return count;
  }
}
