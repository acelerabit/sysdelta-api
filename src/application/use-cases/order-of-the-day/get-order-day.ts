import { OrderDay } from '@/application/entities/order-of-the-day';
import { OrderDaysRepository } from '@/application/repositories/order-of-the-day-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface RequestOrderDayProps {
  orderDayId: string;
}

interface ResponseOrderDayProps {
  orderDay: OrderDay;
}

@Injectable()
export class GetOrderDay {
  constructor(private orderDaysRepository: OrderDaysRepository) {}

  async execute(data: RequestOrderDayProps): Promise<ResponseOrderDayProps> {
    const { orderDayId } = data;

    const orderDayFound = await this.orderDaysRepository.findById(orderDayId);

    if (!orderDayFound) {
      throw new BadRequestException('Sessão não encontrada', {
        cause: new Error('Sessão não encontrada'),
        description: 'Sessão não encontrada',
      });
    }

    return { orderDay: orderDayFound };
  }
}
