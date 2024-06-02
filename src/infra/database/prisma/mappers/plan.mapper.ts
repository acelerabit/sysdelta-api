import { Plan } from 'src/application/entities/plan';
import { Prisma, Plan as PrismaPlan } from '@prisma/client';

export class PrismaPlansMapper {
  static toDomain(plan: PrismaPlan) {
    return Plan.create(
      {
        active: plan.active,
        durationInMonths: plan.durationInMonths,
        externalId: plan.externalId,
        interval: plan.interval,
        name: plan.name,
        priceExternalId: plan.priceExternalId,
        public: plan.public,
        value: plan.value,
        createdAt: plan.created_at,
        isDefault: plan.isDefault,
        trialDays: plan.trialDays,
      },
      plan.id,
    );
  }

  static toPrisma(plan: Plan): Prisma.PlanUncheckedCreateInput {
    return {
      active: plan.active,
      durationInMonths: plan.durationInMonths,
      externalId: plan.externalId,
      interval: plan.interval,
      name: plan.name,
      priceExternalId: plan.priceExternalId,
      public: plan.public,
      value: plan.value,
      created_at: plan.createdAt,
      isDefault: plan.isDefault,
      trialDays: plan.trialDays,
    };
  }
}
