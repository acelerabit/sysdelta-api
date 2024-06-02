import { Payment } from '../entities/payment';

export abstract class PaymentRepository {
  abstract create(payment: Payment): Promise<void>;
  abstract findByExternalId(id: string): Promise<Payment | null>;
  abstract update(payment: Payment): Promise<void>;
  abstract findByUserId(id: string): Promise<Payment[]>;
  abstract findUnpaidByUser(id: string): Promise<Payment[]>;
}
