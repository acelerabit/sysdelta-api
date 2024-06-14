import { BillingService } from '@/infra/billing/billing.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PlanRepository } from 'src/application/repositories/plan-repository';
import { SubscriptionRepository } from 'src/application/repositories/subscription-repository';
import { UsersRepository } from 'src/application/repositories/user-repository';

interface CreatePaymentIntentRequest {
  userId: string;
  planId?: string;
}

@Injectable()
export class CreatePaymentIntent {
  constructor(
    private planRepository: PlanRepository,
    private userRepository: UsersRepository,
    private subRepository: SubscriptionRepository,
    private billingService: BillingService,
  ) {}
  async execute({ userId, planId }: CreatePaymentIntentRequest) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException('Não foi possivel encontrar o usuário', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    if (planId) {
      const plan = await this.planRepository.findById(planId);

      if (!plan) {
        throw new BadRequestException('Não foi possivel encontrar esse plano', {
          cause: new Error('Plano não encontrado'),
          description: 'Plano não encontrado',
        });
      }

      if (plan.value <= 0) {
        throw new BadRequestException(
          'Não se deve cadastrar método de pagamento para o plano free',
          {
            cause: new Error('Plano não aceita método de pagamento'),
            description: 'Plano não aceita método de pagamento',
          },
        );
      }

      // console.log({ user, plan });

      const price = await this.billingService.retrievePrice(
        plan.priceExternalId,
      );

      if (!price) {
        throw new BadRequestException(
          'Não foi possivel encontrar o preço desse plano',
          {
            cause: new Error('Preço não encontrado'),
            description: 'Preço não encontrado',
          },
        );
      }

      const { clientSecret } = await this.billingService.createPayment({
        price: price.unit_amount,
        customerId: user.externalId,
      });

      return {
        clientSecret,
      };
    }

    // console.log(user.subscription);

    const subscription = await this.subRepository.findById(user.subscriptionId);

    if (!subscription) {
      throw new BadRequestException('Não foi possivel encontrar a inscriçao', {
        cause: new Error('Inscrição não encontrada'),
        description: 'Inscrição não encontrada',
      });
    }

    const plan = await this.planRepository.findById(subscription.planId);

    if (!plan) {
      throw new BadRequestException('Não foi possivel encontrar esse plano', {
        cause: new Error('Plano não encontrado'),
        description: 'Plano não encontrado',
      });
    }

    const price = await this.billingService.retrievePrice(plan.priceExternalId);

    if (!price) {
      throw new BadRequestException(
        'Não foi possivel encontrar o preço desse plano',
        {
          cause: new Error('Preço não encontrado'),
          description: 'Preço não encontrado',
        },
      );
    }

    const { clientSecret } = await this.billingService.createPayment({
      price: price.unit_amount,
      customerId: user.externalId,
    });

    return {
      clientSecret,
    };
  }
}
