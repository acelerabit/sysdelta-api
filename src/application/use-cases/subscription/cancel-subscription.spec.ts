import { randomUUID } from 'crypto';
import { Subscription } from 'src/application/entities/subscription';
import { InMemorySubscriptionRepository } from 'test/repositories/subscription/in-memory-subscription-repository';
import { InMemoryUsersRepository } from 'test/repositories/user/in-memory-user-repository';
import { CancelSubscription } from './cancel-subscription';
import { User } from 'src/application/entities/user';
import { InMemoryPlanRepository } from 'test/repositories/plan/in-memory-plan-repository';
import { Plan } from 'src/application/entities/plan';
import { vi } from 'vitest';

describe('Cancel subscription usecase', () => {
  const mock = vi.fn().mockImplementation(() => {
    return {
      cancelSubscription: vi.fn().mockReturnValue({
        subscription: {
          status: 'canceled',
        },
      }),
    };
  });

  it('Should be able to cancel a subscription', async () => {
    const userRepository = new InMemoryUsersRepository();
    const stripeServiceMock = mock();
    const subsRepository = new InMemorySubscriptionRepository(userRepository);
    const planRepository = new InMemoryPlanRepository();

    const usecase = new CancelSubscription(
      subsRepository,
      stripeServiceMock,
      planRepository,
    );

    const newUser = new User({
      email: 'email@test.com',
      name: 'user test',
      password: '123',
      role: 'ADMIN',
      createdAt: new Date(),
    });

    const newPlan = new Plan({
      active: false,
      externalId: null,
      name: 'Free',
      priceExternalId: null,
      value: 0,
      interval: 'month',
      durationInMonths: 0,
      public: false,
      qtdReports: 10,
      canIntegrate: false,
      qtdProjects: 1,
      trialDays: 0,
    });

    const planCharged = new Plan({
      active: false,
      externalId: randomUUID(),
      name: 'Charge',
      priceExternalId: randomUUID(),
      value: 100,
      interval: 'month',
      durationInMonths: 1,
      public: false,
      qtdReports: 10,
      canIntegrate: false,
      qtdProjects: 1,
      trialDays: 10,
    });

    await planRepository.create(newPlan);

    const newSubscription = new Subscription({
      active: true,
      externalId: randomUUID(),
      planId: planCharged.id,
      planStatus: 'active',
      value: 100,
      userId: newUser.id,
      plan: planCharged,
    });

    newUser.subscriptionId = newSubscription.id;
    newUser.saveSubscription(newSubscription);

    await userRepository.create(newUser);

    await subsRepository.create(newSubscription);

    const { subscription } = await usecase.execute({
      userId: newUser.id,
    });

    expect(subscription.plan.name).toEqual(newPlan.name);
  });
});
