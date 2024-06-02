import { randomUUID } from 'crypto';
import { Plan } from 'src/application/entities/plan';
import { Subscription } from 'src/application/entities/subscription';
import { InMemoryPlanRepository } from 'test/repositories/plan/in-memory-plan-repository';
import { InMemorySubscriptionRepository } from 'test/repositories/subscription/in-memory-subscription-repository';
import { FetchSubscriptions } from './fetch-subscriptions';
import { InMemoryUsersRepository } from 'test/repositories/user/in-memory-user-repository';
import { vi } from 'vitest';

vi.mock('../../../../utils/hash-password', () => ({
  hashPassword: vi.fn().mockReturnValue('sdjksjdlkjskld'),
}));

describe('List Subscription usecase', () => {
  it('Should be able to fetch all subscriptions', async () => {
    const planRepository = new InMemoryPlanRepository();
    const userRepository = new InMemoryUsersRepository();
    const subRepository = new InMemorySubscriptionRepository(userRepository);

    const usecase = new FetchSubscriptions(subRepository);

    const newPlan = new Plan({
      active: false,
      externalId: randomUUID(),
      name: 'Basic',
      priceExternalId: randomUUID(),
      value: 1000,
      interval: 'month',
      durationInMonths: 1,
      public: false,
      qtdReports: 10,
      canIntegrate: true,
      qtdProjects: 1,
    });

    await planRepository.create(newPlan);

    const newSubscription = new Subscription({
      active: true,
      externalId: randomUUID(),
      planId: newPlan.id,
      planStatus: 'active',
      value: 100,
      userId: randomUUID(),
    });

    const newSubscription2 = new Subscription({
      active: true,
      externalId: randomUUID(),
      planId: newPlan.id,
      planStatus: 'active',
      value: 100,
      userId: randomUUID(),
    });

    await subRepository.create(newSubscription);
    await subRepository.create(newSubscription2);

    const { subscriptions } = await usecase.execute({});

    expect(subscriptions).toHaveLength(2);
  });
});
