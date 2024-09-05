import { OrderDaysRepository } from '@/application/repositories/order-of-the-day-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@/@shared/pagination-interface';
import { OrderDay } from '@/application/entities/order-of-the-day';
import { PrismaOrderDaysMapper } from '../mappers/order-day.mapper';

@Injectable()
export class PrismaOrderDaysRepository implements OrderDaysRepository {
  constructor(private prismaService: PrismaService) {}

  async create(orderDay: OrderDay): Promise<void> {
    const toPrisma = PrismaOrderDaysMapper.toPrisma(orderDay);

    await this.prismaService.orderDay.create({
      data: toPrisma,
    });

    return;
  }

  async count(): Promise<number> {
    return await this.prismaService.orderDay.count();
  }

  async findById(id: string): Promise<OrderDay | null> {
    const orderDay = await this.prismaService.orderDay.findFirst({
      where: {
        id,
      },
    });

    if (!orderDay) {
      return null;
    }

    return PrismaOrderDaysMapper.toDomain(orderDay);
  }

  async fetchBySessionId(
    sessionId: string,
    pagination: PaginationParams,
  ): Promise<OrderDay[]> {
    const orderDays = await this.prismaService.orderDay.findMany({
      where: {
        sessionId,
      },
      take: pagination.itemsPerPage,
      skip: (pagination.page - 1) * pagination.itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orderDays.map(PrismaOrderDaysMapper.toDomain);
  }

  async findBySessionId(sessionId: string): Promise<OrderDay | null> {
    const orderDay = await this.prismaService.orderDay.findFirst({
      where: {
        sessionId,
      },
      include: {
        legislativeMatters: true,
      },
    });

    if (!orderDay) {
      return null;
    }

    return PrismaOrderDaysMapper.toDomain(orderDay);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.orderDay.delete({
      where: {
        id,
      },
    });
  }

  async update(orderDay: OrderDay): Promise<void> {
    const toPrisma = PrismaOrderDaysMapper.toPrisma(orderDay);

    await this.prismaService.orderDay.update({
      where: {
        id: orderDay.id,
      },
      data: toPrisma,
    });

    return;
  }
}
