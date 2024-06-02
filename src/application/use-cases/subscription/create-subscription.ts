import { BillingService } from '@/infra/billing/billing.service';
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Subscription } from 'src/application/entities/subscription';
import { User } from 'src/application/entities/user';
import { PlanRepository } from 'src/application/repositories/plan-repository';
import { SubscriptionRepository } from 'src/application/repositories/subscription-repository';
import { UsersRepository } from 'src/application/repositories/user-repository';

interface CreateSubscriptionRequest {
  user: {
    name: string;
    email: string;
    password: string;
  };
  planId: string;
  acceptNotifications: boolean;
}

@Injectable()
export class CreateSubscription {
  constructor(
    private userRepository: UsersRepository,
    private planRepository: PlanRepository,
    private subRepository: SubscriptionRepository,
    private billingService: BillingService,
    private hasher: BcryptHasher,
  ) {}

  async execute({
    user,
    planId,
    acceptNotifications,
  }: CreateSubscriptionRequest) {
    const { name, email, password } = user;

    const plan = await this.planRepository.findById(planId);

    if (!plan) {
      throw new BadRequestException('Não foi possivel criar o usuário', {
        cause: new Error('Plano não encontrado'),
        description: 'Plano não encontrado',
      });
    }

    if (plan.value <= 0) {
      const customer = await this.billingService.createCustomer({
        name,
        email,
        metadata: { plan: 'free' },
      });

      if (!customer) {
        throw new BadRequestException('Não foi possivel criar o usuário', {
          cause: new Error('Não foi possivel criar o customer no stripe'),
          description: 'Não foi possivel criar o customer no stripe',
        });
      }

      const passwordHashed = await this.hasher.hash(password);

      const userData = new User({
        email,
        name,
        role: 'USER',
        externalId: customer.id,
        password: passwordHashed,
        acceptNotifications,
      });

      const sub = new Subscription({
        externalId: null,
        active: true,
        planId: plan.id,
        userId: userData.id,
        planStatus: 'active',
        value: plan.value,
      });

      sub.plan = plan;

      userData.subscriptionId = sub.id;
      userData.saveSubscription(sub);

      sub.user = userData;

      await this.userRepository.create(userData);
      await this.subRepository.create(sub);

      return;
    }

    if (!plan.trialDays) {
      throw new BadRequestException('Não foi possivel criar o usuário', {
        cause: new Error('Esse plano não tem periodo de teste'),
        description: 'Esse plano não tem periodo de teste',
      });
    }

    const customer = await this.billingService.createCustomer({ name, email });

    if (!customer) {
      throw new BadRequestException('Não foi possivel criar o usuário', {
        cause: new Error('Não foi possivel criar o customer no stripe'),
        description: 'Não foi possivel criar o customer no stripe',
      });
    }

    const subscription = await this.billingService.createSubscription(
      customer.id,
      plan.priceExternalId,
      plan.trialDays,
    );

    const passwordHashed = await this.hasher.hash(password);

    const userData = new User({
      email,
      name,
      role: 'USER',
      externalId: customer.id,
      password: passwordHashed,
      acceptNotifications,
    });

    const sub = new Subscription({
      externalId: subscription.id,
      active: true,
      planId: plan.id,
      userId: userData.id,
      planStatus: subscription.status,
      value: plan.value,
      expiration: subscription.current_period_end,
    });

    sub.plan = plan;

    userData.subscriptionId = sub.id;
    userData.saveSubscription(sub);

    sub.user = userData;

    await this.userRepository.create(userData);
    await this.subRepository.create(sub);

    return;
  }
}
