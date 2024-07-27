import { BillingService } from '@/infra/billing/billing.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PlanRepository } from 'src/application/repositories/plan-repository';
import { SubscriptionRepository } from 'src/application/repositories/subscription-repository';
import { UsersRepository } from 'src/application/repositories/user-repository';

interface ActivateSubscriptionRequest {
  userId: string;
  paymentMethod: string;
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
    planId,
    paymentMethod,
  }: ActivateSubscriptionRequest): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException('Não foi possivel encontrar esse usuário', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    const userSub = await this.subRepository.findById(user.subscriptionId);

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

      await this.billingService.attachPaymentToCustomer(
        user.externalId,
        paymentMethod,
      );

      const subRetrieved =
        await this.billingService.retrieveSubscriptionByCustomer(
          user.externalId,
        );

      userSub.externalId = subRetrieved.id;
      userSub.planStatus = subRetrieved.status;
      userSub.expiration = subRetrieved.current_period_end;
      userSub.planId = planId;
      userSub.value = plan.value;
      userSub.plan = plan;
      userSub.paymentMethodId = paymentMethod;

      await this.subRepository.update(userSub);

      return;
    }

    return;
  }
}
