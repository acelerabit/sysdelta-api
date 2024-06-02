import { BillingService } from '@/infra/billing/billing.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Subscription } from 'src/application/entities/subscription';
import { PlanRepository } from 'src/application/repositories/plan-repository';
import { SubscriptionRepository } from 'src/application/repositories/subscription-repository';
import { UsersRepository } from 'src/application/repositories/user-repository';

interface UpdateUserSubscriptionRequest {
  userId: string;
  planId: string;
}

@Injectable()
export class UpdateUserSubscription {
  constructor(
    private userRepository: UsersRepository,
    private planRepository: PlanRepository,
    private subRepository: SubscriptionRepository,
    private billingService: BillingService,
  ) {}

  async execute({ userId, planId }: UpdateUserSubscriptionRequest) {
    const plan = await this.planRepository.findById(planId);

    if (!plan) {
      throw new BadRequestException('Plano não encontrado', {
        cause: new Error('Plano não encontrado'),
        description: 'Plano não encontrado',
      });
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new BadRequestException(
        'Não foi possivel criar a assinatura do usuário',
        {
          cause: new Error('Usuário não encontrado'),
          description: 'Usuário não encontrado',
        },
      );
    }

    const userSub = await this.subRepository.findByUserId(user.id);

    const userHasSub = userSub ?? false;
    const planIsFree = plan.value <= 0;
    const planHasTrial = plan.trialDays > 0;
    const subHasPaymentMethod = userSub?.paymentMethodId ?? false;
    const currentUserSubIsFree = userSub?.value <= 0;

    if (!userHasSub) {
      // usuário não tem assinatura

      if (planIsFree) {
        // plano é gratuito, cria uma assinatura no nosso banco e retorna

        const sub = new Subscription({
          externalId: null,
          active: true,
          planId: plan.id,
          userId: user.id,
          planStatus: 'active',
          value: plan.value,
        });

        sub.plan = plan;

        user.subscriptionId = sub.id;
        user.saveSubscription(sub);

        await this.userRepository.update(user);
        await this.subRepository.create(sub);

        return { subscription: sub };
      }

      if (planHasTrial) {
        // criar assinatura no stripe, cria no nossa banco, salva e retorna

        const subscription = await this.billingService.createSubscription(
          user.externalId,
          plan.priceExternalId,
          plan.trialDays,
        );

        const sub = new Subscription({
          externalId: subscription.id,
          active: true,
          planId: plan.id,
          userId: user.id,
          planStatus: subscription.status,
          value: plan.value,
          expiration: subscription.current_period_end,
        });

        sub.plan = plan;

        user.subscriptionId = sub.id;
        user.saveSubscription(sub);

        await this.userRepository.update(user);
        await this.subRepository.create(sub);

        return { subscription: sub };
      }

      // da erro, usuário não tem assinatura e o plano é precisa de uma forma de pagamento
      throw new BadRequestException(
        'Usuário não tem assinatura nem método de pagamento cadastrado',
        {
          cause: new Error(
            'Usuário não tem assinatura nem método de pagamento cadastrado',
          ),
          description:
            'Usuário não tem assinatura nem método de pagamento cadastrado',
        },
      );
    }

    if (userHasSub && !subHasPaymentMethod) {
      // usuário tem assinatura mas não tem método de pagamento

      if (currentUserSubIsFree && planHasTrial) {
        // criar assinatura no stripe, atualiza no nossa banco,salva e retorna

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
        userSub.active = true;

        await this.subRepository.update(userSub);

        return { subscription: userSub };
      }

      if (!currentUserSubIsFree && planIsFree) {
        // cancela no stripe, remove as referencias do stripe no nosso banco, atualiza para o novo plano free
        await this.billingService.cancelSubscription(userSub.externalId);

        userSub.externalId = null;
        userSub.paymentMethodId = null;
        userSub.planId = planId;
        userSub.value = plan.value;
        userSub.plan = plan;
        userSub.active = true;

        await this.subRepository.update(userSub);

        return { subscription: userSub };
      }

      if (!currentUserSubIsFree && planHasTrial) {
        // atualiza assinatura no stripe, atualiza no nosso banco, salva e retorna
        const subscriptionItems =
          await this.billingService.retrieveSubscriptionItems(
            userSub.externalId,
          );

        const [subItem] = subscriptionItems.data;

        const subscriptionUpdated =
          await this.billingService.upgradeSubscription(
            subItem.id,
            plan.priceExternalId,
            userSub.externalId,
          );

        userSub.expiration = subscriptionUpdated.current_period_end;
        userSub.planId = plan.id;
        userSub.planStatus = subscriptionUpdated.status;
        userSub.value = plan.value;
        userSub.externalId = subscriptionUpdated.id;
        userSub.active = true;

        await this.subRepository.update(userSub);

        return { subscription: userSub };
      }

      // da erro, usuário não tem metódo de pagamento mas quer um plano que exige

      throw new BadRequestException(
        'Usuário não tem método de pagamento cadastrado',
        {
          cause: new Error('Usuário não tem método de pagamento cadastrado'),
          description: 'Usuário não tem método de pagamento cadastrado',
        },
      );
    }

    if (userHasSub && subHasPaymentMethod) {
      // usuário tem assinatura e tem método de pagamento

      if (planIsFree) {
        // cancela no stripe, remove as referencias do stripe no nosso banco, atualiza para o novo plano free
        await this.billingService.cancelSubscription(userSub.externalId);

        userSub.externalId = null;
        userSub.paymentMethodId = null;
        userSub.planId = planId;
        userSub.value = plan.value;
        userSub.plan = plan;
        userSub.planStatus = 'active';
        userSub.active = true;

        await this.subRepository.update(userSub);

        return { subscription: userSub };
      }

      if (planHasTrial) {
        // atualiza assinatura no stripe, atualiza no nosso banco, salva e retorna
        const subscriptionItems =
          await this.billingService.retrieveSubscriptionItems(
            userSub.externalId,
          );

        const [subItem] = subscriptionItems.data;

        const subscriptionUpdated =
          await this.billingService.upgradeSubscription(
            subItem.id,
            plan.priceExternalId,
            userSub.externalId,
          );

        userSub.expiration = subscriptionUpdated.current_period_end;
        userSub.planId = plan.id;
        userSub.planStatus = subscriptionUpdated.status;
        userSub.value = plan.value;
        userSub.externalId = subscriptionUpdated.id;
        userSub.active = true;

        await this.subRepository.update(userSub);

        return { subscription: userSub };
      }

      if (!planHasTrial) {
        // atualiza assinatura no stripe, atualiza no nosso banco, salva e retorna
        const subscriptionItems =
          await this.billingService.retrieveSubscriptionItems(
            userSub.externalId,
          );

        const [subItem] = subscriptionItems.data;

        const subscriptionUpdated =
          await this.billingService.upgradeSubscription(
            subItem.id,
            plan.priceExternalId,
            userSub.externalId,
          );

        userSub.expiration = subscriptionUpdated.current_period_end;
        userSub.planId = plan.id;
        userSub.planStatus = subscriptionUpdated.status;
        userSub.value = plan.value;
        userSub.externalId = subscriptionUpdated.id;
        userSub.active = true;

        await this.subRepository.update(userSub);

        return { subscription: userSub };
      }

      throw new BadRequestException('Erro ao realizar a associação do plano', {
        cause: new Error('Erro ao realizar a associação do plano'),
        description: 'Erro ao realizar a associação do plano',
      });
    }
  }
}
