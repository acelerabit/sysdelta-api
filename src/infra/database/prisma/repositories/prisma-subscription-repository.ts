import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SubscriptionRepository } from 'src/application/repositories/subscription-repository';
import { Subscription } from 'src/application/entities/subscription';
import { DateService } from '@/infra/dates/date.service';
import { PrismaSubscriptionsMapper } from '../mappers/subscription.mapper';

@Injectable()
export class PrismaSubscriptionRepository implements SubscriptionRepository {
  constructor(
    private prismaService: PrismaService,
    private dateService: DateService,
  ) {}

  async create(sub: Subscription): Promise<void> {
    const createdAt = this.dateService.dateToSaveInDB(sub.createdAt);

    await this.prismaService.subscription.create({
      data: {
        active: sub.active,
        id: sub.id,
        externalId: sub.externalId,
        value: sub.value,
        planStatus: sub.planStatus,
        expiration: sub.expiration,
        createdAt: createdAt,
        userId: sub.userId,
        planId: sub.planId,
      },
    });
  }

  async findAll(
    startDate?: Date,
    endDate?: Date,
    planId?: string,
    active?: string,
  ): Promise<Subscription[]> {
    const raw = await this.prismaService.subscription.findMany({
      where: {
        AND: [
          {
            planId: planId
              ? {
                  equals: planId,
                }
              : {},
          },
          {
            createdAt:
              startDate && endDate
                ? {
                    gte: new Date(startDate).toISOString(),
                    lte: new Date(endDate).toISOString(),
                  }
                : {},
          },
          {
            active:
              active === 'false'
                ? {
                    equals: false,
                  }
                : {
                    equals: true,
                  },
          },
        ],
      },
      include: {
        plan: true,
        user: true,
      },
    });

    return raw.map(PrismaSubscriptionsMapper.toDomain);
  }

  async findById(id: string): Promise<Subscription> {
    const raw = await this.prismaService.subscription.findUnique({
      where: {
        id,
      },
      include: {
        plan: true,
        user: true,
      },
    });

    return PrismaSubscriptionsMapper.toDomain(raw);
  }

  async findByUserId(userId: string, onlyActive = true): Promise<Subscription> {
    // resolver isso, fazendo testes se caso não buscar apenas as ativas da erro
    const raw = await this.prismaService.subscription.findFirst({
      where: {
        AND: [
          {
            userId,
          },
          // {
          //   active: onlyActive ? true : {},
          // },
        ],
      },
      include: {
        plan: true,
        user: true,
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaSubscriptionsMapper.toDomain(raw);
  }

  async count(): Promise<number> {
    const count = await this.prismaService.subscription.count();

    return count;
  }

  async findAllSubsWithThisPlan(planId: string): Promise<number> {
    const result = await this.prismaService.subscription.count({
      where: {
        planId: planId,
      },
    });

    return result;
  }

  async update(sub: Subscription): Promise<void> {
    await this.prismaService.subscription.update({
      where: {
        id: sub.id,
      },
      data: {
        paymentMethodId: sub.paymentMethodId,
        planStatus: sub.planStatus,
        active: sub.active,
        planId: sub.planId,
        expiration: sub.expiration,
        value: sub.value,
        externalId: sub.externalId,
      },
    });
  }
}
