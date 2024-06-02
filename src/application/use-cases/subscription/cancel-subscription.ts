import { BillingService } from '@/infra/billing/billing.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Subscription } from 'src/application/entities/subscription';
import { PlanRepository } from 'src/application/repositories/plan-repository';
import { SubscriptionRepository } from 'src/application/repositories/subscription-repository';

interface CancelSubscriptionRequest {
  userId: string;
}

interface CancelSubscriptionResponse {
  subscription: Subscription;
}

@Injectable()
export class CancelSubscription {
  constructor(
    private subRepository: SubscriptionRepository,
    private billingService: BillingService,
    private planRepository: PlanRepository,
  ) {}

  async execute({
    userId,
  }: CancelSubscriptionRequest): Promise<CancelSubscriptionResponse> {
    const userSub = await this.subRepository.findByUserId(userId);

    if (!userSub) {
      throw new BadRequestException(
        'Não foi possivel encontrar a assinatura desse usuário',
        {
          cause: new Error('Assinatura não encontrado'),
          description: 'Assinatura não encontrado',
        },
      );
    }

    // buscar o plano default e não qualquer gratuito
    const defaultPlan = await this.planRepository.findByDefault();

    if (!defaultPlan) {
      throw new BadRequestException(
        'Não foi encontrado nenhum plano gratuito',
        {
          cause: new Error('Não foi encontrado nenhum plano gratuito'),
          description: 'Não foi encontrado nenhum plano gratuito',
        },
      );
    }

    if (userSub.plan.value <= 0) {
      return { subscription: userSub };
    }

    await this.billingService.cancelSubscription(userSub.externalId);

    userSub.externalId = null;
    userSub.paymentMethodId = null;
    userSub.planId = defaultPlan.id;
    userSub.value = defaultPlan.value;
    userSub.plan = defaultPlan;
    userSub.planStatus = 'active';
    userSub.active = true;

    await this.subRepository.update(userSub);

    return { subscription: userSub };
  }
}
