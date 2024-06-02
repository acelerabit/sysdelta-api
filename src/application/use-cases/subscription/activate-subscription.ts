import { BillingService } from '@/infra/billing/billing.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PlanRepository } from 'src/application/repositories/plan-repository';
import { SubscriptionRepository } from 'src/application/repositories/subscription-repository';
import { UsersRepository } from 'src/application/repositories/user-repository';

interface ActivateSubscriptionRequest {
  userId: string;
  paymentIntentId: string;
  planId?: string;
}

@Injectable()
export class ActivateSubscription {
  constructor(
    private userRepository: UsersRepository,
    private billingService: BillingService,
    private subRepository: SubscriptionRepository,
    private planRepository: PlanRepository,
  ) {}

  async execute({
    userId,
    paymentIntentId,
    planId,
  }: ActivateSubscriptionRequest): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException('Não foi possivel encontrar esse usuário', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    const userSub = await this.subRepository.findByUserId(user.id);

    if (!userSub) {
      throw new BadRequestException(
        'Não foi possivel encontrar assinatura desse usuário',
        {
          cause: new Error('Assinatura não encontrado'),
          description: 'Assinatura não encontrado',
        },
      );
    }

    if (planId) {
      const plan = await this.planRepository.findById(planId);

      if (!plan) {
        throw new BadRequestException('Não foi possivel criar o usuário', {
          cause: new Error('Plano não encontrado'),
          description: 'Plano não encontrado',
        });
      }

      const subCreated = await this.billingService.createSubscription(
        user.externalId,
        plan.priceExternalId,
        plan.trialDays,
      );

      userSub.externalId = subCreated.id;
      userSub.planStatus = subCreated.status;
      userSub.expiration = subCreated.current_period_end;
      userSub.planId = planId;
      userSub.value = plan.value;
      userSub.plan = plan;

      await this.subRepository.update(userSub);

      const { paymentMethodId, subscription } =
        await this.billingService.activateSubscription(
          user.externalId,
          paymentIntentId,
          userSub.externalId,
        );

      userSub.externalId = subscription.id;
      userSub.paymentMethodId = paymentMethodId;
      userSub.planStatus = subscription.status;
      await this.subRepository.update(userSub);

      return;
    }

    const { paymentMethodId, subscription } =
      await this.billingService.activateSubscription(
        user.externalId,
        paymentIntentId,
        userSub.externalId,
      );

    userSub.externalId = subscription.id;
    userSub.paymentMethodId = paymentMethodId;
    userSub.planStatus = subscription.status;
    userSub.expiration = subscription.current_period_end;

    await this.subRepository.update(userSub);

    return;
  }
}
