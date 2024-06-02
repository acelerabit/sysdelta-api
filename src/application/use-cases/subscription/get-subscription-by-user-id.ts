import { BadRequestException, Injectable } from '@nestjs/common';
import { Subscription } from 'src/application/entities/subscription';
import { SubscriptionRepository } from 'src/application/repositories/subscription-repository';

interface GetUserSubscriptionRequest {
  userId: string;
}

interface GetUserSubscriptionResponse {
  subscription: Subscription;
}

@Injectable()
export class GetUserSubscription {
  constructor(
    // private userRepository: UsersRepository,
    private subRepository: SubscriptionRepository,
  ) {}

  async execute({
    userId,
  }: GetUserSubscriptionRequest): Promise<GetUserSubscriptionResponse> {
    const subscription = await this.subRepository.findByUserId(userId);

    if (!subscription) {
      throw new BadRequestException(
        'Não foi possivel encontrar a inscrição desse usuário',
        {
          cause: new Error('Inscrição não encontrado'),
          description: 'Inscrição não encontrado',
        },
      );
    }

    return { subscription };
  }
}
