import { Injectable } from '@nestjs/common';
import { Subscription } from 'src/application/entities/subscription';
import { SubscriptionRepository } from 'src/application/repositories/subscription-repository';

interface FetchSubscriptionsRequest {
  planId?: string;
  startDate?: Date;
  endDate?: Date;
  active?: string;
}

interface FetchSubscriptionsResponse {
  subscriptions: Subscription[];
}

@Injectable()
export class FetchSubscriptions {
  constructor(private subRepository: SubscriptionRepository) {}

  async execute({
    planId,
    startDate,
    endDate,
    active,
  }: FetchSubscriptionsRequest): Promise<FetchSubscriptionsResponse> {
    const subscriptions = await this.subRepository.findAll(
      startDate,
      endDate,
      planId,
      active,
    );

    return { subscriptions };
  }
}
