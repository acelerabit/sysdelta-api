import { Prisma } from '@prisma/client';
import { Payment } from 'src/application/entities/payment';
import { PrismaSubscriptionsMapper } from './subscription.mapper';
import { PrismaUsersMapper } from './user.mapper';

export class PrismaPaymentsMapper {
  static toDomain(payment: any) {
    return Payment.create(
      {
        completed: payment.completed,
        externalId: payment.externalId,
        subscriptionId: payment.subscriptionId,
        value: payment.value,
        userId: payment.userId,
        paymentDate: payment.paymentDate,
        subscription: payment.subscription
          ? PrismaSubscriptionsMapper.toDomain(payment.subscription)
          : null,
        user: payment.user ? PrismaUsersMapper.toDomain(payment.user) : null,
        voucher: payment.voucher,
        createdAt: payment.createdAt,
        updatedAt: payment.createdAt,
      },
      payment.id,
    );
  }

  static toPrisma(payment: Payment): Prisma.PaymentUncheckedCreateInput {
    return {
      completed: payment.completed,
      externalId: payment.externalId,
      subscriptionId: payment.subscriptionId,
      value: payment.value,
      userId: payment.userId,
      paymentDate: payment.paymentDate,
      voucher: payment.voucher,
      createdAt: payment.createdAt,
      updatedAt: payment.createdAt,
    };
  }
}
