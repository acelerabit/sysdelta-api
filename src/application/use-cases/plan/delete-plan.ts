import { PlanRepository } from '@/application/repositories/plan-repository';
import { SubscriptionRepository } from '@/application/repositories/subscription-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface DeletePlanRequest {
  id: string;
}

@Injectable()
export class DeletePlan {
  constructor(
    private planRepository: PlanRepository,
    private subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute({ id }: DeletePlanRequest): Promise<void> {
    const plan = await this.planRepository.findById(id);

    if (!plan) {
      throw new BadRequestException('Não foi possivel encontrar esse plano', {
        cause: new Error('Plano não encontrado'),
        description: 'Plano não encontrado',
      });
    }

    // verificar se não tem nenhum usuário atrelado ao plano

    const subsWithThisPlan =
      await this.subscriptionRepository.findAllSubsWithThisPlan(plan.id);

    if (subsWithThisPlan > 0) {
      throw new BadRequestException('Não foi possivel deletar esse plano', {
        cause: new Error('Esse plano já tem usuários relacionados a ele'),
        description: 'Esse plano já tem usuários relacionados a ele',
      });
    }

    await this.planRepository.delete(plan.id);

    return;
  }
}
