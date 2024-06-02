import { PlanRepository } from '@/application/repositories/plan-repository';
import { BillingService } from '@/infra/billing/billing.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Plan } from 'src/application/entities/plan';

interface DeactivatePlanRequest {
  id: string;
}

interface DeactivatePlanResponse {
  plan: Plan;
}

@Injectable()
export class DeactivatePlan {
  constructor(
    private planRepository: PlanRepository,
    private billingService: BillingService,
  ) {}

  async execute({
    id,
  }: DeactivatePlanRequest): Promise<DeactivatePlanResponse> {
    const plan = await this.planRepository.findById(id);

    if (!plan) {
      throw new BadRequestException('Não foi possivel encontrar esse plano', {
        cause: new Error('Plano não encontrado'),
        description: 'Plano não encontrado',
      });
    }

    if (plan.value <= 0) {
      await this.planRepository.deactivatePlan(plan.id);

      return { plan };
    }

    await this.billingService.inactivePlan(plan.externalId);

    await this.planRepository.deactivatePlan(plan.id);
    await this.planRepository.unpublishPlan(plan.id);

    return { plan };
  }
}
