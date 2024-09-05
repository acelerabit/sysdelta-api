import { PaginationParams } from '@/@shared/pagination-interface';
import { OrderDay } from '@/application/entities/order-of-the-day';
import { OrderDaysRepository } from '@/application/repositories/order-of-the-day-repository';
import { Injectable } from '@nestjs/common';

interface RequestOrderDayProps {
  sessionId: string;
  pagination: PaginationParams;
}

interface ResponseOrderDayProps {
  orderDays: OrderDay[];
}

@Injectable()
export class FetchOrderDay {
  constructor(private orderDaysRepository: OrderDaysRepository) {}

  async execute(data: RequestOrderDayProps): Promise<ResponseOrderDayProps> {
    const { sessionId, pagination } = data;

    const orderDays = await this.orderDaysRepository.fetchBySessionId(
      sessionId,
      pagination,
    );

    return { orderDays };
  }
}
