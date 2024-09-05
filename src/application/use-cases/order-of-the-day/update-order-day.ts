import { OrderDay } from '@/application/entities/order-of-the-day';
import { OrderDaysRepository } from '@/application/repositories/order-of-the-day-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface RequestOrderDayProps {
  summary: string;
  orderDayId: string;
}

@Injectable()
export class UpdateOrderDay {
  constructor(private orderDaysRepository: OrderDaysRepository) {}

  async execute(data: RequestOrderDayProps): Promise<void> {
    const { summary, orderDayId } = data;

    const orderDayFound = await this.orderDaysRepository.findById(orderDayId);

    if (!orderDayFound) {
      throw new BadRequestException('Sessão não encontrada', {
        cause: new Error('Sessão não encontrada'),
        description: 'Sessão não encontrada',
      });
    }

    const updates: Partial<OrderDay> = {};

    if (summary) {
      updates.summary = summary;
    }

    updates.updatedAt = new Date();

    Object.assign(orderDayFound, updates);

    await this.orderDaysRepository.update(orderDayFound);

    return;
  }
}
