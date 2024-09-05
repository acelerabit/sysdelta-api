import { LegislativeMatter } from '@/application/entities/legislative-matter';
import { Prisma } from '@prisma/client';
import { OrderDay } from 'src/application/entities/order-of-the-day';

export class PrismaOrderDaysMapper {
  static toDomain(orderDay: any) {
    return OrderDay.create(
      {
        summary: orderDay.summary,
        sessionId: orderDay.sessionId,
        createdAt: orderDay.createdAt,
        legislativeMatters: orderDay.legislativeMatters.map(
          (legislativeMatter) =>
            LegislativeMatter.create({
              code: legislativeMatter.code,
              presentationDate: legislativeMatter.presentationDate,
              status: legislativeMatter.status,
              summary: legislativeMatter.summary,
              title: legislativeMatter.title,
              type: legislativeMatter.type,
              votingType: legislativeMatter.votingType,
              authorId: legislativeMatter.authorId,
              sessionId: legislativeMatter.sessionId,
            }),
        ),
      },
      orderDay.id,
    );
  }

  static toPrisma(orderDay: OrderDay): Prisma.OrderDayUncheckedCreateInput {
    return {
      id: orderDay.id,
      summary: orderDay.summary,
      sessionId: orderDay.sessionId,
      createdAt: orderDay.createdAt,
    };
  }
}
