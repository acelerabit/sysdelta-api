import { FetchUserCards } from '@/application/use-cases/card/fetch-user-cards';
import { GetUserCard } from '@/application/use-cases/card/get-user-card';
import { ActivateSubscription } from '@/application/use-cases/subscription/activate-subscription';
import { CreateSubscription } from '@/application/use-cases/subscription/create-subscription';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CancelSubscription } from 'src/application/use-cases/subscription/cancel-subscription';
import { ChangePaymentMethod } from 'src/application/use-cases/subscription/change-payment-method';
import { UpdateUserSubscription } from 'src/application/use-cases/subscription/change-user-subscription';
import { CheckUserSubscription } from 'src/application/use-cases/subscription/check-user-subscription';
import { FetchSubscriptions } from 'src/application/use-cases/subscription/fetch-subscriptions';
import { GetUserSubscription } from 'src/application/use-cases/subscription/get-subscription-by-user-id';
import { Auth } from 'src/infra/decorators/auth.decorator';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private getUserSubscription: GetUserSubscription,
    private fetchSubscriptions: FetchSubscriptions,
    private cancelSubscription: CancelSubscription,
    private getUserCard: GetUserCard,
    private changePaymentMethod: ChangePaymentMethod,
    private fetchUserCards: FetchUserCards,
    private checkUserSubscription: CheckUserSubscription,
    private changeUserSubscription: UpdateUserSubscription,
    private createSubscription: CreateSubscription,
    private activateSubscription: ActivateSubscription,
  ) {}

  @Post('/create-subscription/:planId')
  async createSub(
    @Param('planId') planId: string,
    @Body()
    body: {
      user: {
        name: string;
        email: string;
        password: string;
      };
      acceptNotifications: boolean;
    },
  ) {
    const { user, acceptNotifications } = body;
    return this.createSubscription.execute({
      user,
      planId,
      acceptNotifications,
    });
  }

  @Auth(Role.ADMIN, Role.USER)
  @Post('/activate-subscription/:userId')
  async activateSub(
    @Param('userId') userId: string,
    @Body()
    body: {
      planId?: string;
      paymentMethod: string;
    },
  ) {
    const { planId, paymentMethod } = body;
    return this.activateSubscription.execute({
      userId,
      planId,
      paymentMethod,
    });
  }

  @Auth(Role.ADMIN, Role.USER)
  @Get('/:userId')
  async getUserSub(@Param('userId') userId: string) {
    const { subscription } = await this.getUserSubscription.execute({
      userId,
    });

    return {
      id: subscription.id,
      active: subscription.active,
      createdAt: subscription.createdAt,
      value: subscription.value,
      status: subscription.planStatus,
      paymentMethodId: subscription.paymentMethodId,
      plan: {
        id: subscription.plan.id,
        name: subscription.plan.name,
        durationInMonths: subscription.plan.durationInMonths,
        value: subscription.plan.value,
        trialDays: subscription.plan.trialDays,
      },
      user: {
        id: subscription.user.id,
        name: subscription.user.name,
        email: subscription.user.email,
      },
    };
  }

  @Auth(Role.ADMIN)
  @Get('/fetch/subs')
  async fetchSubs(
    @Query()
    query: {
      planId?: string;
      startDate?: Date;
      endDate?: Date;
      active?: string;
    },
  ) {
    const { planId, startDate, endDate, active } = query;

    const { subscriptions } = await this.fetchSubscriptions.execute({
      planId,
      startDate,
      endDate,
      active,
    });

    return {
      subscriptions: subscriptions.map((subscription) => {
        return {
          id: subscription.id,
          active: subscription.active,
          createdAt: subscription.createdAt,
          value: subscription.value,
          status: subscription.planStatus,
          plan: {
            id: subscription.plan.id,
            name: subscription.plan.name,
            durationInMonths: subscription.plan.durationInMonths,
            value: subscription.plan.value,
          },
          user: {
            id: subscription.user.id,
            name: subscription.user.name,
            email: subscription.user.email,
          },
        };
      }),
    };
  }

  @Auth(Role.ADMIN, Role.USER)
  @Get('/check-sub/:userId')
  async checkSub(@Param('userId') userId: string) {
    const { checked } = await this.checkUserSubscription.execute({
      userId,
    });

    return {
      checked,
    };
  }

  @Auth(Role.ADMIN, Role.USER)
  @Get('/card/:userId')
  async getCard(@Param('userId') userId: string) {
    const { card } = await this.getUserCard.execute({
      userId,
    });

    return {
      card,
    };
  }

  @Auth(Role.ADMIN, Role.USER)
  @Get('/fetch/cards/:userId')
  async fetchCards(@Param('userId') userId: string) {
    const { cards } = await this.fetchUserCards.execute({
      userId,
    });

    return {
      cards,
    };
  }

  @Auth(Role.ADMIN, Role.USER)
  @Patch('/cancel/:userId')
  async cancelSub(@Param('userId') userId: string) {
    const { subscription } = await this.cancelSubscription.execute({
      userId,
    });

    return {
      id: subscription.id,
      active: subscription.active,
      createdAt: subscription.createdAt,
      value: subscription.value,
      status: subscription.planStatus,
      plan: {
        id: subscription.plan.id,
        name: subscription.plan.name,
        durationInMonths: subscription.plan.durationInMonths,
        value: subscription.plan.value,
      },
    };
  }

  @Auth(Role.ADMIN, Role.USER)
  @Patch('/change-payment-method/:userId')
  async changePayment(
    @Param('userId') userId: string,
    @Body() body: { paymentMethodId: string },
  ) {
    const { subscription } = await this.changePaymentMethod.execute({
      userId,
      paymentMethodId: body.paymentMethodId,
    });

    return {
      id: subscription.id,
      active: subscription.active,
      createdAt: subscription.createdAt,
      value: subscription.value,
      status: subscription.planStatus,
      paymentMethodId: subscription.paymentMethodId,
      plan: {
        id: subscription.plan.id,
        name: subscription.plan.name,
        durationInMonths: subscription.plan.durationInMonths,
        value: subscription.plan.value,
      },
    };
  }

  @Auth(Role.ADMIN, Role.USER)
  @Post('/assign/:userId')
  async assignSubToUser(
    @Param('userId') userId: string,
    @Body() body: { planId: string },
  ) {
    const { planId } = body;

    const { subscription } = await this.changeUserSubscription.execute({
      userId,
      planId,
    });

    return {
      id: subscription.id,
      active: subscription.active,
      createdAt: subscription.createdAt,
      value: subscription.value,
      status: subscription.planStatus,
      plan: {
        id: subscription.plan.id,
        name: subscription.plan.name,
        durationInMonths: subscription.plan.durationInMonths,
        value: subscription.plan.value,
      },
    };
  }
}
