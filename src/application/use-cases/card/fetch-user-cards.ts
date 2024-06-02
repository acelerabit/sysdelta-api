import { BillingService } from '@/infra/billing/billing.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SubscriptionRepository } from 'src/application/repositories/subscription-repository';
import { UsersRepository } from 'src/application/repositories/user-repository';

export interface FetchUserCardsRequest {
  userId: string;
}

@Injectable()
export class FetchUserCards {
  constructor(
    private userRepository: UsersRepository,
    private subRepository: SubscriptionRepository,
    private billingService: BillingService,
  ) {}

  async execute({ userId }: FetchUserCardsRequest) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException('Não foi possivel encontrar esse usuário', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    const userSub = await this.subRepository.findByUserId(userId);

    if (!userSub) {
      throw new BadRequestException('Assinatura não encontrada', {
        cause: new Error('Assinatura do usuário não encontrada'),
        description: 'Assinatura do usuário não encontrada',
      });
    }

    if (!userSub.paymentMethodId) {
      throw new BadRequestException(
        'Usuário não tem método de pagamento cadastrado',
        {
          cause: new Error('Usuário não tem método de pagamento cadastrado'),
          description: 'Usuário não tem método de pagamento cadastrado',
        },
      );
    }

    const paymentMethods = await this.billingService.listCustomerPaymentMethods(
      userSub.user.externalId,
    );

    const cards = paymentMethods.data.map((paymentMethod) => {
      return {
        lastNumbers: paymentMethod.card.last4,
        expYear: paymentMethod.card.exp_year,
        expMonth: paymentMethod.card.exp_month,
      };
    });

    return { cards };
  }
}
