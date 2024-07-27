import { CreatePayment } from '@/application/use-cases/payments/create-payment';
import { CreatePaymentIntent } from '@/application/use-cases/payments/create-payment-intent';
import { BillingWebhookService } from '@/infra/billing/billing-webhook.service';
import {
  Body,
  Controller,
  Post,
  Headers,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { FetchPayments } from 'src/application/use-cases/payments/fetch-payments';
import { FetchUnpaidPayments } from 'src/application/use-cases/payments/fetch-unpaid-payments';
import { Auth } from 'src/infra/decorators/auth.decorator';

@Controller('payment')
export class PaymentController {
  constructor(
    private billingWebhookService: BillingWebhookService,
    private fetchPayments: FetchPayments,
    private fetchUnpaidPayments: FetchUnpaidPayments,
    private createPaymentIntent: CreatePaymentIntent,
    private createPaymentSub: CreatePayment,
  ) {}

  @Auth(Role.ADMIN, Role.USER)
  @Get('/:userId')
  async payments(@Param('userId') userId: string) {
    const { payments } = await this.fetchPayments.execute({ userId });

    return payments.map((payment) => ({
      id: payment.id,
      paymentDate: payment.paymentDate,
      value: payment.value,
      completed: payment.completed,
      voucher: payment.voucher,
      plan: {
        name: payment.subscription.plan.name,
      },
    }));
  }

  @Get('/unpaid/:userId')
  async unpaidPayments(@Param('userId') userId: string) {
    const { payments } = await this.fetchUnpaidPayments.execute({ userId });

    return payments.map((payment) => ({
      id: payment.id,
      paymentDate: payment.paymentDate,
      value: payment.value,
      voucher: payment.voucher,
      completed: payment.completed,
      plan: {
        name: payment.subscription.plan.name,
      },
    }));
  }

  @Get('/create-payment-intent/user/:userId')
  async createPayment(
    @Param('userId') userId: string,
    @Query() query: { planId?: string },
  ) {
    const { planId } = query;
    return this.createPaymentIntent.execute({
      userId,
      planId,
    });
  }

  @Post('/create-payment/user/:userId')
  async createPaymentToSub(
    @Param('userId') userId: string,
    @Body() body: { planId?: string },
  ) {
    const { planId } = body;
    return this.createPaymentSub.execute({
      userId,
      planId,
    });
  }

  @Post('/stripe-webhooks')
  async webhook(@Body() data: any, @Headers() headers: any): Promise<any> {
    return await this.billingWebhookService.webhook(data);
  }
}
