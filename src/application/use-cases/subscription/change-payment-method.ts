import { BillingService } from '@/infra/billing/billing.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Subscription } from 'src/application/entities/subscription';
import { SubscriptionRepository } from 'src/application/repositories/subscription-repository';

interface ChangePaymentMethodRequest {
  userId: string;
  paymentMethodId: string;
}

interface ChangePaymentMethodResponse {
  subscription: Subscription;
}

@Injectable()
export class ChangePaymentMethod {
  constructor(
    private subRepository: SubscriptionRepository,
    private billingService: BillingService,
  ) {}

  async execute({
    userId,
    paymentMethodId,
  }: ChangePaymentMethodRequest): Promise<ChangePaymentMethodResponse> {
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

    try {
      await this.billingService.changePaymentMethod(
        userSub.user.externalId,
        paymentMethodId,
      );

      userSub.paymentMethodId = paymentMethodId;
      await this.subRepository.update(userSub);

      return { subscription: userSub };
    } catch (err) {
      throw new BadRequestException(
        'Não foi possivel cadastrar nova forma de pagamento',
        {
          cause: new Error('Algum erro inesperado ocorreu'),
          description: 'Algum erro inesperado ocorreu',
        },
      );
    }
  }
}
