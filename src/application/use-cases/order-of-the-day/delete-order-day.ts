import { OrderDaysRepository } from '@/application/repositories/order-of-the-day-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface RequestOrderDayProps {
  orderDayId: string;
}

@Injectable()
export class DeleteOrderDay {
  constructor(private orderDaysRepository: OrderDaysRepository) {}

  async execute(data: RequestOrderDayProps): Promise<void> {
    const { orderDayId } = data;

    const orderDayFound = await this.orderDaysRepository.findById(orderDayId);

    if (!orderDayFound) {
      throw new BadRequestException('Sessão não encontrada', {
        cause: new Error('Sessão não encontrada'),
        description: 'Sessão não encontrada',
      });
    }

    await this.orderDaysRepository.delete(orderDayId);

    return;
  }
}
