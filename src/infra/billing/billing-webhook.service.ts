import { Injectable } from '@nestjs/common';

export const config = {
  api: {
    bodyParser: false,
  },
};

@Injectable()
export class BillingWebhookService {
  async webhook(data: any) {}
}
