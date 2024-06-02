import { randomUUID } from 'crypto';
import { Plan } from 'src/application/entities/plan';
import { InMemoryPlanRepository } from 'test/repositories/plan/in-memory-plan-repository';
import { InMemorySubscriptionRepository } from 'test/repositories/subscription/in-memory-subscription-repository';
import { InMemoryUsersRepository } from 'test/repositories/user/in-memory-user-repository';
import { CreateSubscription } from './create-subscription';
import { DayjsService } from '../../../providers/dayjs';
import { vi } from 'vitest';

vi.mock('../../../../utils/hash-password', () => ({
  hashPassword: vi.fn().mockReturnValue('sdjksjdlkjskld'),
}));

describe('Create Subscription usecase', () => {
  const mock = vi.fn().mockImplementation(() => {
    return {
      createCustomer: vi.fn().mockReturnValue({
        id: randomUUID(),
      }),
      createSubscription: vi.fn().mockReturnValue({
        id: randomUUID(),
        status: 'active',
        current_period_end: 1672182,
      }),
    };
  });
  it('Should be able to create a payment intent', async () => {
    const planRepository = new InMemoryPlanRepository();
    const usersRepository = new InMemoryUsersRepository();
    const dayjsService = new DayjsService();
    const subRepository = new InMemorySubscriptionRepository(usersRepository);

    const stripeServiceMock = mock();
    const usecase = new CreateSubscription(
      usersRepository,

      planRepository,
      subRepository,
      stripeServiceMock,
      dayjsService,
    );

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
      trialDays: 10,
    });

    await planRepository.create(newPlan);

    await usecase.execute({
      planId: newPlan.id,
      user: {
        name: 'Teste customer',
        email: 'customer@gmail.com',
        password: '123',
      },
      acceptNotification: true,
    });

    expect(subRepository.subs[0].id).toBeDefined();
  });
});
