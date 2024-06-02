import { Injectable } from '@nestjs/common';
import { PaymentRepository } from 'src/application/repositories/payment-repository';
import { PrismaService } from '../prisma.service';
import { Payment } from 'src/application/entities/payment';
import { PrismaPaymentsMapper } from '../mappers/payment.mapper';

@Injectable()
export class PrismaPaymentRepository implements PaymentRepository {
  constructor(private prismaService: PrismaService) {}

  create(payment: Payment): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findByExternalId(id: string): Promise<Payment> {
    throw new Error('Method not implemented.');
  }
  update(payment: Payment): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findByUserId(id: string): Promise<Payment[]> {
    const raw = await this.prismaService.payment.findMany({
      where: {
        userId: id,
      },
      include: {
        subscription: {
          include: {
            user: true,
            plan: true,
          },
        },
      },
    });

    return raw.map(PrismaPaymentsMapper.toDomain);
  }

  async findUnpaidByUser(id: string): Promise<Payment[]> {
    const raw = await this.prismaService.payment.findMany({
      where: {
        userId: id,
        paymentDate: null,
      },
      include: {
        subscription: {
          include: {
            user: true,
            plan: true,
          },
        },
      },
    });

    return raw.map(PrismaPaymentsMapper.toDomain);
  }
}
