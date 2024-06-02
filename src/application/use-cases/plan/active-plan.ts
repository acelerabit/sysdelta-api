import { PlanRepository } from '@/application/repositories/plan-repository';
import { BillingService } from '@/infra/billing/billing.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Plan } from 'src/application/entities/plan';

interface ActivePlanRequest {
  id: string;
}

interface ActivePlanResponse {
  plan: Plan;
}

@Injectable()
export class ActivePlan {
  constructor(
    private planRepository: PlanRepository,
    private billingService: BillingService,
  ) {}

  async execute({ id }: ActivePlanRequest): Promise<ActivePlanResponse> {
    const plan = await this.planRepository.findById(id);

    if (!plan) {
      throw new BadRequestException('Não foi possivel encontrar esse plano', {
        cause: new Error('Plano não encontrado'),
        description: 'Plano não encontrado',
      });
    }

    if (plan.value <= 0) {
      await this.planRepository.activatePlan(plan.id);

      return { plan };
    }

    await this.billingService.activatePlan(plan.externalId);

    await this.planRepository.activatePlan(plan.id);

    return { plan };
  }
}
