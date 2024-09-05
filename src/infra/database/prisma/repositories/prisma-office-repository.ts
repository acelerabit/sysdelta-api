import { PaginationParams } from '@/@shared/pagination-interface';
import { Office } from '@/application/entities/office';
import { OfficesRepository } from '@/application/repositories/office-repository';
import { Injectable } from '@nestjs/common';
import { PrismaOfficesMapper } from '../mappers/office.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaOfficesRepository implements OfficesRepository {
  constructor(private prismaService: PrismaService) {}

  async create(office: Office): Promise<void> {
    const toPrisma = PrismaOfficesMapper.toPrisma(office);

    await this.prismaService.office.create({
      data: toPrisma,
    });

    return;
  }

  async count(): Promise<number> {
    return await this.prismaService.office.count();
  }

  async findById(id: string): Promise<Office | null> {
    const office = await this.prismaService.office.findFirst({
      where: {
        id,
      },
    });

    if (!office) {
      return null;
    }

    return PrismaOfficesMapper.toDomain(office);
  }

  async findBySessionId(sessionId: string): Promise<Office | null> {
    const office = await this.prismaService.office.findFirst({
      where: {
        sessionId,
      },
      include: {
        legislativeMatters: true,
      },
    });

    if (!office) {
      return null;
    }

    return PrismaOfficesMapper.toDomain(office);
  }

  async fetchBySessionId(
    sessionId: string,
    pagination: PaginationParams,
  ): Promise<Office[]> {
    const offices = await this.prismaService.office.findMany({
      where: {
        sessionId,
      },
      take: pagination.itemsPerPage,
      skip: (pagination.page - 1) * pagination.itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return offices.map(PrismaOfficesMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.office.delete({
      where: {
        id,
      },
    });
  }

  async update(office: Office): Promise<void> {
    const toPrisma = PrismaOfficesMapper.toPrisma(office);

    await this.prismaService.office.update({
      where: {
        id: office.id,
      },
      data: toPrisma,
    });

    return;
  }
}
