import { OrderDay } from '@/application/entities/order-of-the-day';

export class OrderDaysPresenters {
  static toHTTP(orderDay: OrderDay) {
    return {
      id: orderDay.id,
      createdAt: orderDay.createdAt,
      updatedAt: orderDay.updatedAt,
      summary: orderDay.summary,
      sessionId: orderDay.sessionId,
    };
  }
}
