import { PaginationParams } from '@/@shared/pagination-interface';
import { LegislativeMatter } from '@/application/entities/legislative-matter';
import { LegislativeMattersRepository } from '@/application/repositories/legislative-matter-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaLegislativeMattersMapper } from '../mappers/legislative.mapper';

@Injectable()
export class PrismaLegislativeMattersRepository
  implements LegislativeMattersRepository
{
  constructor(private prismaService: PrismaService) {}

  async create(legislativeMatter: LegislativeMatter): Promise<void> {
    const toPrisma = PrismaLegislativeMattersMapper.toPrisma(legislativeMatter);

    await this.prismaService.legislativeMatter.create({
      data: toPrisma,
    });

    return;
  }

  async findAll(pagination: PaginationParams): Promise<LegislativeMatter[]> {
    const legislativeMatters =
      await this.prismaService.legislativeMatter.findMany({
        take: pagination.itemsPerPage,
        skip: (pagination.page - 1) * pagination.itemsPerPage,
        orderBy: {
          createdAt: 'desc',
        },
      });

    return legislativeMatters.map(PrismaLegislativeMattersMapper.toDomain);
  }

  async findAllWithoutPaginate(): Promise<LegislativeMatter[]> {
    const legislativeMatters =
      await this.prismaService.legislativeMatter.findMany();

    return legislativeMatters.map(PrismaLegislativeMattersMapper.toDomain);
  }

  async count(): Promise<number> {
    return await this.prismaService.legislativeMatter.count();
  }

  async findByCode(code: number): Promise<LegislativeMatter | null> {
    const legislativeMatter =
      await this.prismaService.legislativeMatter.findFirst({
        where: {
          code,
        },
      });

    if (!legislativeMatter) {
      return null;
    }

    return PrismaLegislativeMattersMapper.toDomain(legislativeMatter);
  }

  async fetchBySessionId(
    sessionId: string,
    pagination: PaginationParams,
    from,
  ): Promise<LegislativeMatter[]> {
    const legislativeMatters =
      await this.prismaService.legislativeMatter.findMany({
        where: {
          sessionId,
          OR: [
            {
              orderDayId: from,
            },
            {
              officeId: from,
            },
          ],
        },
        take: pagination.itemsPerPage,
        skip: (pagination.page - 1) * pagination.itemsPerPage,
        orderBy: {
          createdAt: 'desc',
        },
      });

    return legislativeMatters.map(PrismaLegislativeMattersMapper.toDomain);
  }

  async findById(id: string): Promise<LegislativeMatter | null> {
    const legislativeMatter =
      await this.prismaService.legislativeMatter.findFirst({
        where: {
          id,
        },
      });

    if (!legislativeMatter) {
      return null;
    }

    return PrismaLegislativeMattersMapper.toDomain(legislativeMatter);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.legislativeMatter.delete({
      where: {
        id,
      },
    });
  }

  async update(legislativeMatter: LegislativeMatter): Promise<void> {
    const toPrisma = PrismaLegislativeMattersMapper.toPrisma(legislativeMatter);

    await this.prismaService.legislativeMatter.update({
      where: {
        id: legislativeMatter.id,
      },
      data: toPrisma,
    });

    return;
  }
}
