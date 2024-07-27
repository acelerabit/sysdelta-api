import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EMAIL_QUEUE } from '@/common/constants';
import { UserPlanStatus } from '@prisma/client';
import dayjs from 'dayjs';

export const config = {
  api: {
    bodyParser: false,
  },
};

@Injectable()
export class BillingWebhookService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('payment-check') private readonly paymentCheckQueue: Queue,
    @InjectQueue(EMAIL_QUEUE) private sendMailQueue: Queue,
  ) {}

  async webhook(data: any) {
    const event = data;

    // Handle the event
    switch (event.type) {
      case 'invoice.upcoming': // alguns dias antes da fatura vencer
        console.log('UPCOMING');
        break;
      case 'invoice.updated':
        const invoiceUpdated = event.data.object;

        const findInvoiceUpdated = await this.prisma.payment.findFirst({
          where: {
            externalId: invoiceUpdated.id,
          },
        });

        if (!findInvoiceUpdated) return;

        await this.prisma.payment.update({
          where: {
            externalId: findInvoiceUpdated.id,
          },
          data: {
            status: findInvoiceUpdated.status,
          },
        });

        break;
      case 'customer.subscription.created': // alguns dias antes da fatura vencer
        // console.log('STRIPE SUB CREATED', event.data);
        console.log('STRIPE SUB CREATED');

        break;
      case 'customer.subscription.updated': // alguns dias antes da fatura vencer
        // update the subscription status
        console.log('STRIPE SUB UPDATED', event.data.object);
        const invoiceSubUpdated = event.data.object;

        const findSubUpdated = await this.prisma.subscription.findFirst({
          where: {
            externalId: invoiceSubUpdated.id,
          },
        });

        if (!findSubUpdated) return;

        await this.prisma.subscription.update({
          where: {
            id: findSubUpdated.id,
          },
          data: {
            planStatus: invoiceSubUpdated.status,
          },
        });

        break;

      case 'payment_intent.succeeded': // alguns dias antes da fatura vencer
        // console.log('STRIPE PAYMENT INTENT PAID', event.data);
        console.log('STRIPE PAYMENT INTENT PAID');

        break;
      case 'invoice.created': // no dia do vencimento da fatura
        console.log('INVOICE CREATED');

        const invoice = event.data.object;

        const customer = await this.prisma.user.findFirst({
          where: {
            externalId: invoice.customer,
          },
          include: {
            payments: true,
            subscription: true,
          },
        });

        if (!customer) throw new NotFoundException('Cliente não encontrado');

        if (!customer.subscription)
          throw new NotFoundException('Assinatura não encontrada');

        // if (customer.payment.length == 0) return;

        const findPayment = await this.prisma.payment.findFirst({
          where: {
            externalId: invoice.id,
          },
        });

        if (findPayment) return; // caso tenha sido criada dentro do createSubscription

        await this.prisma.payment.create({
          data: {
            externalId: invoice.id,
            value: Number(invoice['amount_due']) / 100,
            voucher: invoice.hosted_invoice_url,
            subscription: {
              connect: {
                id: customer.subscription[0].id || '',
              },
            },
            user: {
              connect: {
                id: customer.id,
              },
            },
          },
        });

        break;
      case 'invoice.paid': // no pagamento da fatura
        console.log('INVOICE PAID');

        // só transformar a subscription em ativa se o usuário não tiver nenhum pagamento pendente

        const paidInvoice = event.data.object;

        const findPaidInvoice = await this.prisma.payment.findFirst({
          where: {
            externalId: paidInvoice.id,
          },
        });

        if (!findPaidInvoice)
          throw new NotFoundException('Erro ao finalizar pagamento');

        const updatedPayment = await this.prisma.payment.update({
          where: {
            id: findPaidInvoice.id,
          },
          data: {
            paymentDate: dayjs().toISOString(),
            completed: true,
          },
          include: {
            user: true,
          },
        });

        await this.prisma.subscription.update({
          where: {
            id: updatedPayment.subscriptionId,
          },
          data: {
            active: true,
            // completed: true,
            planStatus:
              updatedPayment.value != 0
                ? UserPlanStatus.active
                : UserPlanStatus.trialing,
          },
          include: {
            payments: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        });

        await this.sendMailQueue.add('send-mail-job', {
          email: updatedPayment.user.email,
          subject: 'Pagamento confirmado',
          templateName: 'payment-confirmed.hbs',
          context: {
            name: updatedPayment.user.name,
            // supportUrl: `https://feedbit.com/support`,
          },
        });

        break;
      case 'invoice.payment_failed': // no dia do vencimento da fatura
        console.log('INVOICE PAYMENT FAILED');

        const failedInvoice = event.data.object;

        const findCreatedInvoice = await this.prisma.payment.findFirst({
          where: {
            externalId: failedInvoice.id,
          },
          include: {
            user: true,
          },
        });

        if (!findCreatedInvoice)
          throw new NotFoundException('Pagamento não criado');

        if (findCreatedInvoice.attempts > 0) {
          return;
        }

        await this.sendMailQueue.add('send-mail-job', {
          email: updatedPayment.user.email,
          subject: 'Falha no pagamento',
          templateName: 'payment-failed.hbs',
          context: {
            paymentUrl: findCreatedInvoice.voucher,
            // supportUrl: `https://feedbit.com/support`,
          },
        });

        break;
      case 'invoice.overdue':
        console.log('INVOICE OVERDUE');

        const overduedInvoice = event.data.object;

        const findOverduedInvoice = await this.prisma.payment.findFirst({
          where: {
            externalId: overduedInvoice.id,
          },
        });

        if (!findOverduedInvoice)
          throw new NotFoundException('Pagamento não criado');
        break;
      case 'customer.subscription.deleted': // quando uma subscription acaba
        console.log('CUSTOMER SUBSCRIPTION DELETED');

        const subscription = event.data.object;

        const findSubscription = await this.prisma.subscription.findFirst({
          where: {
            externalId: subscription.id,
          },
        });

        if (!findSubscription)
          throw new NotFoundException('Subscription não encontrada');

        await this.prisma.subscription.update({
          where: {
            id: findSubscription.id,
          },
          data: {
            active: false,
            planStatus: UserPlanStatus.canceled,
          },
          include: {
            payments: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        });

        break;
      case 'customer.subscription.paused':
        console.log('CUSTOMER SUBSCRIPTION PAUSED');

        const subPaused = event.data.object;

        const findSub = await this.prisma.subscription.findFirst({
          where: {
            externalId: subPaused.id,
          },
          include: {
            user: true,
          },
        });

        if (!findSub)
          throw new NotFoundException('Subscription não encontrada');

        await this.sendMailQueue.add('send-mail-job', {
          email: findSub.user.email,
          subject: 'Periodo de teste no feedbit finalizado',
          text: `O seu periodo de teste na aplicação feedbit foi finalizado`,
        });

        await this.prisma.subscription.update({
          where: {
            id: findSubscription.id,
          },
          data: {
            active: false,
            planStatus: UserPlanStatus.paused,
          },
          include: {
            payments: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        });

        break;
      case 'customer.created': // quando um cliente é criado
        console.log('CUSTOMER CREATED');
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
