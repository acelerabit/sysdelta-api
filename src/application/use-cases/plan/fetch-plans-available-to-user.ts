import { PlanRepository } from '@/application/repositories/plan-repository';
import { SubscriptionRepository } from '@/application/repositories/subscription-repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Plan } from 'src/application/entities/plan';
import { UsersRepository } from 'src/application/repositories/user-repository';

interface FetchPlansAvailableToUserRequest {
  userId: string;
}

interface FetchPlansAvailableToUserResponse {
  plans: Plan[];
}

@Injectable()
export class FetchPlansAvailableToUser {
  constructor(
    private planRepository: PlanRepository,
    private userRepository: UsersRepository,
    private subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute({
    userId,
  }: FetchPlansAvailableToUserRequest): Promise<FetchPlansAvailableToUserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException('Não foi possivel encontrar esse usuário', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    const userSub = await this.subscriptionRepository.findByUserId(userId);

    if (!userSub) {
      const plans = await this.planRepository.findAll({
        active: true,
        withTrial: true,
        free: true,
      });

      return { plans };
    }

    if (userSub.paymentMethodId) {
      // buscar todos os planos ativos

      const plans = await this.planRepository.findAll({ active: true });

      return { plans };
    } else {
      // buscar todos os planos ativos e com trial

      const plans = await this.planRepository.findAll({ withTrial: true });

      return { plans };
    }
  }
}
