import { Injectable } from '@nestjs/common';
import { Plan } from 'src/application/entities/plan';
import { PlanRepository } from 'src/application/repositories/plan-repository';
import { PrismaService } from '../prisma.service';
import { PrismaPlansMapper } from '../mappers/plan.mapper';

@Injectable()
export class PrismaPlansRepository implements PlanRepository {
  constructor(private prismaService: PrismaService) {}

  async create(plan: Plan): Promise<void> {
    await this.prismaService.plan.create({
      data: {
        id: plan.id,
        durationInMonths: plan.durationInMonths,
        externalId: plan.externalId,
        interval: plan.interval,
        name: plan.name,
        priceExternalId: plan.priceExternalId,
        value: plan.value,
        active: plan.active,
        created_at: plan.createdAt,
        trialDays: plan.trialDays,
      },
    });
  }

  async findAll({
    active,
    withTrial,
    publicPlan,
    free,
  }: {
    active?: boolean;
    withTrial?: boolean;
    publicPlan?: boolean;
    free?: boolean;
  }): Promise<Plan[]> {
    const plans = await this.prismaService.plan.findMany({
      where: {
        AND: [
          {
            active: active
              ? {
                  equals: true,
                }
              : {},
          },
          {
            OR: [
              {
                value: free
                  ? {
                      lte: 0,
                    }
                  : {},
              },
              {
                trialDays: withTrial
                  ? {
                      gt: 0,
                    }
                  : {},
              },
            ],
          },
          {
            public: publicPlan
              ? {
                  equals: true,
                }
              : {},
          },
        ],
      },
    });

    return plans.map(PrismaPlansMapper.toDomain);
  }

  async findAllAvailablePlans(): Promise<Plan[]> {
    const plans = await this.prismaService.plan.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                value: {
                  lte: 0,
                },
              },
              {
                active: true,
              },
              {
                public: true,
              },
            ],
          },
          {
            AND: [
              {
                trialDays: {
                  gt: 0,
                },
              },
              {
                active: true,
              },
              {
                public: true,
              },
            ],
          },
        ],
      },
    });

    return plans.map(PrismaPlansMapper.toDomain);
  }

  async findById(id: string): Promise<Plan | null> {
    const plan = await this.prismaService.plan.findFirst({
      where: {
        id,
      },
    });

    if (!plan) {
      return null;
    }

    return PrismaPlansMapper.toDomain(plan);
  }

  async findByDefault(): Promise<Plan> {
    const plan = await this.prismaService.plan.findFirst({
      where: {
        isDefault: true,
      },
    });

    if (!plan) {
      return null;
    }

    return PrismaPlansMapper.toDomain(plan);
  }

  async turnPlanDefault(id: string): Promise<void> {
    await this.prismaService.plan.updateMany({
      where: {
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    await this.prismaService.plan.update({
      where: {
        id,
      },
      data: {
        isDefault: true,
      },
    });
  }

  async publishPlan(id: string): Promise<void> {
    await this.prismaService.plan.update({
      where: {
        id,
      },
      data: {
        public: true,
      },
    });
  }

  async findFreePlan(): Promise<Plan> {
    const raw = await this.prismaService.plan.findFirst({
      where: {
        value: {
          lte: 0,
        },
        active: true,
        public: true,
        trialDays: {
          lte: 0,
        },
      },
    });

    if (!raw) {
      return null;
    }

    return PrismaPlansMapper.toDomain(raw);
  }

  async unpublishPlan(id: string): Promise<void> {
    await this.prismaService.plan.update({
      where: {
        id,
      },
      data: {
        public: false,
      },
    });
  }

  async deactivatePlan(id: string): Promise<void> {
    await this.prismaService.plan.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });
  }

  async activatePlan(id: string): Promise<void> {
    await this.prismaService.plan.update({
      where: {
        id,
      },
      data: {
        active: true,
      },
    });
  }

  async update(plan: Plan): Promise<void> {
    await this.prismaService.plan.update({
      where: {
        id: plan.id,
      },
      data: {
        durationInMonths: plan.durationInMonths,
        externalId: plan.externalId,
        interval: plan.interval,
        name: plan.name,
        priceExternalId: plan.priceExternalId,
        value: plan.value,
        trialDays: plan.trialDays,
      },
    });
  }

  async delete(planId: string): Promise<void> {
    await this.prismaService.plan.delete({
      where: {
        id: planId,
      },
    });

    return;
  }
}
