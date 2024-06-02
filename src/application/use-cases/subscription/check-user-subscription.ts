import { BadRequestException, Injectable } from '@nestjs/common';
import { SubscriptionRepository } from 'src/application/repositories/subscription-repository';

interface CheckUserSubscriptionRequest {
  userId: string;
}

interface CheckUserSubscriptionResponse {
  checked: boolean;
}

@Injectable()
export class CheckUserSubscription {
  constructor(private subRepository: SubscriptionRepository) {}

  async execute({
    userId,
  }: CheckUserSubscriptionRequest): Promise<CheckUserSubscriptionResponse> {
    const onlyActive = false;
    const subscription = await this.subRepository.findByUserId(
      userId,
      onlyActive,
    );

    if (!subscription) {
      throw new BadRequestException(
        'Não foi possivel encontrar a assinatura desse usuário',
        {
          cause: new Error('Assinatura não encontrado'),
          description: 'Assinatura não encontrado',
        },
      );
    }

    if (subscription.value <= 0) {
      return { checked: true };
    }

    if (subscription.value > 0 && !subscription.active) {
      return { checked: false };
    }

    // revisar a lógica
    return { checked: true };
  }
}
