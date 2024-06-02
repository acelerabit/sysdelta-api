import { PlanRepository } from '@/application/repositories/plan-repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Plan } from 'src/application/entities/plan';

interface PublishPlanRequest {
  id: string;
}

interface PublishPlanResponse {
  plan: Plan;
}

@Injectable()
export class PublishPlan {
  constructor(private planRepository: PlanRepository) {}

  async execute({ id }: PublishPlanRequest): Promise<PublishPlanResponse> {
    const plan = await this.planRepository.findById(id);

    if (!plan) {
      throw new BadRequestException('Não foi possivel encontrar esse plano', {
        cause: new Error('Plano não encontrado'),
        description: 'Plano não encontrado',
      });
    }

    if (!plan.active) {
      throw new BadRequestException('Não foi possivel públicar esse plano', {
        cause: new Error('Não é possivel públicar um plano inativo'),
        description: 'Não é possivel públicar um plano inativo',
      });
    }

    plan.publishPlan();

    await this.planRepository.publishPlan(plan.id);

    return { plan };
  }
}
