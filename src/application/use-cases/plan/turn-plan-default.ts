import { PlanRepository } from '@/application/repositories/plan-repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Plan } from 'src/application/entities/plan';

interface TurnPlanDefaultRequest {
  id: string;
}

interface TurnPlanDefaultResponse {
  plan: Plan;
}

@Injectable()
export class TurnPlanDefault {
  constructor(private planRepository: PlanRepository) {}

  async execute({
    id,
  }: TurnPlanDefaultRequest): Promise<TurnPlanDefaultResponse> {
    const plan = await this.planRepository.findById(id);

    if (!plan) {
      throw new BadRequestException('Não foi possivel encontrar esse plano', {
        cause: new Error('Plano não encontrado'),
        description: 'Plano não encontrado',
      });
    }

    if (!plan.active) {
      throw new BadRequestException(
        'Não foi possivel tornar default esse plano',
        {
          cause: new Error('Não é possivel tornar default um plano inativo'),
          description: 'Não é possivel tornar default um plano inativo',
        },
      );
    }

    if (plan.value > 0 && plan.trialDays <= 0) {
      throw new BadRequestException(
        'Não foi possivel tornar default esse plano',
        {
          cause: new Error(
            'Não é possivel tornar default um não gratuito ou sem periodo de teste',
          ),
          description:
            'Não é possivel tornar default um não gratuito ou sem periodo de teste',
        },
      );
    }

    plan.turnPlanDefault();

    await this.planRepository.turnPlanDefault(plan.id);

    return { plan };
  }
}
