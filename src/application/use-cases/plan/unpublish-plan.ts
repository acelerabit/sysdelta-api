import { PlanRepository } from '@/application/repositories/plan-repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Plan } from 'src/application/entities/plan';

interface UnpublishPlanRequest {
  id: string;
}

interface UnpublishPlanResponse {
  plan: Plan;
}

@Injectable()
export class UnpublishPlan {
  constructor(private planRepository: PlanRepository) {}

  async execute({ id }: UnpublishPlanRequest): Promise<UnpublishPlanResponse> {
    const plan = await this.planRepository.findById(id);

    if (!plan) {
      throw new BadRequestException('Não foi possivel encontrar esse plano', {
        cause: new Error('Plano não encontrado'),
        description: 'Plano não encontrado',
      });
    }

    plan.unpublishPlan();

    await this.planRepository.unpublishPlan(plan.id);

    return { plan };
  }
}
