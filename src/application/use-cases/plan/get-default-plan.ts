import { PlanRepository } from '@/application/repositories/plan-repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Plan } from 'src/application/entities/plan';

interface GetDefaultPlanResponse {
  plan: Plan;
}

@Injectable()
export class GetDefaultPlan {
  constructor(private planRepository: PlanRepository) {}

  async execute(): Promise<GetDefaultPlanResponse> {
    const plan = await this.planRepository.findByDefault();

    if (!plan) {
      throw new BadRequestException('Não foi possivel encontrar esse plano', {
        cause: new Error('Plano não encontrado'),
        description: 'Plano não encontrado',
      });
    }

    return { plan };
  }
}
