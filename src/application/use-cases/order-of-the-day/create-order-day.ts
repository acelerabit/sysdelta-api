import { OrderDay } from '@/application/entities/order-of-the-day';
import { OrderDaysRepository } from '@/application/repositories/order-of-the-day-repository';
import { Injectable } from '@nestjs/common';

interface RequestOrderDayProps {
  summary: string;
  sessionId: string;
}

interface ResponseOrderDayProps {
  orderDay: OrderDay;
}

@Injectable()
export class CreateOrderDay {
  constructor(private orderDaysRepository: OrderDaysRepository) {}

  async execute(data: RequestOrderDayProps): Promise<ResponseOrderDayProps> {
    const { summary, sessionId } = data;

    const orderDay = OrderDay.create({
      summary,
      sessionId,
    });

    await this.orderDaysRepository.create(orderDay);

    return { orderDay };
  }
}
