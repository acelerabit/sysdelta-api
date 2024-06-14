import { Prisma } from '@prisma/client';
import { Subscription } from 'src/application/entities/subscription';
import { PrismaPlansMapper } from './plan.mapper';
import { PrismaUsersMapper } from './user.mapper';

export class PrismaSubscriptionsMapper {
  static toDomain(subscription: any) {
    return Subscription.create(
      {
        active: subscription.active,
        externalId: subscription.externalId,
        planId: subscription.planId,
        planStatus: subscription.planStatus,
        value: subscription.value,
        expiration: subscription.expiration,
        paymentMethodId: subscription.paymentMethodId,
        userId: subscription.userId,
        plan: subscription.plan
          ? PrismaPlansMapper.toDomain(subscription.plan)
          : null,
        user: subscription.user
          ? PrismaUsersMapper.toDomain(subscription.user)
          : null,
        createdAt: subscription.createdAt,
      },
      subscription.id,
    );
  }

  static toPrisma(
    subscription: Subscription,
  ): Prisma.SubscriptionUncheckedCreateInput {
    return {
      active: subscription.active,
      externalId: subscription.externalId,
      planId: subscription.planId,
      planStatus: subscription.planStatus,
      value: subscription.value,
      expiration: subscription.expiration,
      paymentMethodId: subscription.paymentMethodId,
      userId: subscription.userId,
      createdAt: subscription.createdAt,
    };
  }
}
