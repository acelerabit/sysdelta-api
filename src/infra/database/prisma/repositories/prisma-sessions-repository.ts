import { SessionsRepository } from '@/application/repositories/session-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@/@shared/pagination-interface';
import { Session } from '@/application/entities/session';
import { PrismaSessionsMapper } from '../mappers/session.mapper';
import { DateService } from '@/infra/dates/date.service';

@Injectable()
export class PrismaSessionsRepository implements SessionsRepository {
  constructor(
    private prismaService: PrismaService,
    private dateService: DateService,
  ) {}

  async create(session: Session): Promise<void> {
    const toPrisma = PrismaSessionsMapper.toPrisma(session);

    const openingDateTime = this.dateService.formatToPrismaDateTime(
      session.openingDateTime,
    );

    const closingDateTime = this.dateService.formatToPrismaDateTime(
      session.closingDateTime,
    );

    await this.prismaService.session.create({
      data: { ...toPrisma, openingDateTime, closingDateTime },
    });

    return;
  }

  async findAll(pagination: PaginationParams): Promise<Session[]> {
    const sessions = await this.prismaService.session.findMany({
      take: pagination.itemsPerPage,
      skip: (pagination.page - 1) * pagination.itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sessions.map(PrismaSessionsMapper.toDomain);
  }

  async fetchByCityCouncilId(
    cityCouncilId: string,
    pagination: PaginationParams,
  ): Promise<any[]> {
    const sessions = await this.prismaService.session.findMany({
      where: {
        cityCouncilId,
      },
      take: pagination.itemsPerPage,
      skip: (pagination.page - 1) * pagination.itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sessions.map(PrismaSessionsMapper.toDomain);
  }

  async findAllWithoutPaginate(): Promise<Session[]> {
    const sessions = await this.prismaService.session.findMany();

    return sessions.map(PrismaSessionsMapper.toDomain);
  }

  async count(): Promise<number> {
    return await this.prismaService.session.count();
  }

  async findById(id: string): Promise<Session | null> {
    const session = await this.prismaService.session.findFirst({
      where: {
        id,
      },
    });

    if (!session) {
      return null;
    }

    return PrismaSessionsMapper.toDomain(session);
  }

  async findBySessionNumber(numberSession: number): Promise<Session | null> {
    const session = await this.prismaService.session.findFirst({
      where: {
        numberSession,
      },
      include: {
        legislativeMatter: true,
      },
    });

    if (!session) {
      return null;
    }

    return PrismaSessionsMapper.toDomain(session);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.session.delete({
      where: {
        id,
      },
    });
  }

  async update(session: Session): Promise<void> {
    const toPrisma = PrismaSessionsMapper.toPrisma(session);

    await this.prismaService.session.update({
      where: {
        id: session.id,
      },
      data: toPrisma,
    });

    return;
  }
}
