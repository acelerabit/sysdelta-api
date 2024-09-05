import { PaginationParams } from '@/@shared/pagination-interface';
import { OrderDay } from '../entities/order-of-the-day';

export abstract class OrderDaysRepository {
  abstract create(orderDay: OrderDay): Promise<void>;
  abstract count(): Promise<number>;

  abstract findById(id: string): Promise<OrderDay | null>;
  abstract findBySessionId(sessionId: string): Promise<OrderDay | null>;
  abstract fetchBySessionId(
    sessionId: string,
    pagination: PaginationParams,
  ): Promise<OrderDay[]>;

  abstract delete(id: string): Promise<void>;
  abstract update(orderDay: OrderDay): Promise<void>;
}
