import { Process, Processor } from '@nestjs/bull';
import { NotFoundException } from '@nestjs/common';
import { UserPlanStatus } from '@prisma/client';
import { Job } from 'bull';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';

@Processor('payment-check')
export class PaymentCheckProcessor {
  constructor(private prisma: PrismaService) {}

  @Process('payment-check-task')
  async handlePaymentCheck(job: Job<{ invoiceId: string }>) {
    const invoiceId = job.data.invoiceId;

    const findCreatedInvoice = await this.prisma.payment.findFirst({
      where: {
        externalId: invoiceId,
      },
    });

    if (!findCreatedInvoice)
      throw new NotFoundException('Pagamento não criado');

    console.log(findCreatedInvoice);

    if (findCreatedInvoice.paymentDate) {
      return;
    }

    await this.prisma.subscription.update({
      where: {
        id: findCreatedInvoice.subscriptionId,
      },
      data: {
        active: false,
        planStatus: UserPlanStatus.unpaid,
      },
      include: {
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }
}
