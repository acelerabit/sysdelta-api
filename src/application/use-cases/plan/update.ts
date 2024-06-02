import { PlanRepository } from '@/application/repositories/plan-repository';
import { BillingService } from '@/infra/billing/billing.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Plan } from 'src/application/entities/plan';

interface UpdatePlanRequest {
  id: string;
  name: string;
  price: number;
  trialDays: number;
  durationInMonths: number;
}

interface UpdatePlanResponse {
  plan: Plan;
}

@Injectable()
export class UpdatePlan {
  constructor(
    private planRepository: PlanRepository,
    private billingService: BillingService,
  ) {}

  async execute({
    id,
    price,
    name,
    trialDays,
    durationInMonths,
  }: UpdatePlanRequest): Promise<UpdatePlanResponse> {
    const plan = await this.planRepository.findById(id);

    if (!plan) {
      throw new BadRequestException('Não foi possivel encontrar esse plano', {
        cause: new Error('Plano não encontrado'),
        description: 'Plano não encontrado',
      });
    }

    if (price <= 0) {
      plan.name = name;
      plan.interval = 'month';
      plan.value = price;
      plan.durationInMonths = durationInMonths;
      plan.priceExternalId = null;
      plan.externalId = null;

      plan.trialDays = trialDays ?? null;

      await this.planRepository.update(plan);

      return { plan };
    }

    const newPrice = await this.billingService.createPrice(plan.externalId, {
      value: price,
      duration_months: durationInMonths,
    });

    const planStripe = await this.billingService.updateProductPrice(
      plan.externalId,
      newPrice.id,
      name,
    );

    const currentPrice = await this.billingService.retrievePrice(newPrice.id);

    plan.name = planStripe.name;
    plan.interval = currentPrice.recurring.interval;
    plan.value = currentPrice.unit_amount;
    plan.durationInMonths = currentPrice.recurring.interval_count;
    plan.priceExternalId = currentPrice.id;

    plan.trialDays = trialDays ?? null;

    await this.planRepository.update(plan);

    return { plan };
  }
}
