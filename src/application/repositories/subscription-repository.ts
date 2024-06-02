import { Subscription } from '../entities/subscription';

export abstract class SubscriptionRepository {
  abstract create(subscription: Subscription): Promise<void>;
  abstract findAll(
    startDate?: Date,
    endDate?: Date,
    planId?: string,
    active?: string,
  ): Promise<Subscription[]>;
  abstract findAllSubsWithThisPlan(planId: string): Promise<number>;
  abstract findById(id: string): Promise<Subscription | null>;
  abstract findByUserId(
    userId: string,
    onlyActive?: boolean,
  ): Promise<Subscription | null>;
  abstract update(subscription: Subscription): Promise<void>;
  abstract count(): Promise<number>;
}
