import { OrderDay } from '@/application/entities/order-of-the-day';
import { OrderDaysRepository } from '@/application/repositories/order-of-the-day-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface RequestOrderDayProps {
  sessionId: string;
}

interface ResponseOrderDayProps {
  orderDay: OrderDay;
}

@Injectable()
export class GetOrderDayBySession {
  constructor(private orderDaysRepository: OrderDaysRepository) {}

  async execute(data: RequestOrderDayProps): Promise<ResponseOrderDayProps> {
    const { sessionId } = data;

    const orderDayFound = await this.orderDaysRepository.findBySessionId(
      sessionId,
    );

    if (!orderDayFound) {
      throw new BadRequestException('Dados de expediente não encontrado', {
        cause: new Error('Dados de expediente não encontrado'),
        description: 'Dados de expediente não encontrado',
      });
    }

    return { orderDay: orderDayFound };
  }
}
