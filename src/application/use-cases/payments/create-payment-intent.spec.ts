import { randomUUID } from 'crypto';
import { Plan } from 'src/application/entities/plan';
import { InMemoryPlanRepository } from 'test/repositories/plan/in-memory-plan-repository';
import { InMemoryUsersRepository } from 'test/repositories/user/in-memory-user-repository';
import { CreatePaymentIntent } from './create-payment-intent';
import { InMemorySubscriptionRepository } from 'test/repositories/subscription/in-memory-subscription-repository';
import { User } from 'src/application/entities/user';
import { Subscription } from 'src/application/entities/subscription';
import { vi } from 'vitest';

vi.mock('../../../../utils/hash-password', () => ({
  hashPassword: vi.fn().mockReturnValue('sdjksjdlkjskld'),
}));
describe('Create payment intent usecase', () => {
  const mock = vi.fn().mockImplementation(() => {
    return {
      createPayment: vi.fn().mockReturnValue({
        customer: {
          email: 'customer@gmail.com',
          name: 'Teste customer',
          id: randomUUID(),
        },
        clientSecret: randomUUID(),
      }),
      retrievePrice: vi.fn().mockReturnValue({
        unit_amount: 1000,
      }),
    };
  });
  it('Should be able to create a payment intent', async () => {
    const planRepository = new InMemoryPlanRepository();
    const userRepository = new InMemoryUsersRepository();
    const subRepository = new InMemorySubscriptionRepository(userRepository);
    const stripeServiceMock = mock();
    const usecase = new CreatePaymentIntent(
      planRepository,
      userRepository,
      subRepository,
      stripeServiceMock,
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
      externalId: randomUUID(),
      name: 'Basic',
      priceExternalId: randomUUID(),
      value: 1000,
      interval: 'month',
      durationInMonths: 1,
      public: false,
      qtdReports: 10,
      canIntegrate: false,
      qtdProjects: 1,
    });

    const newSubscription = new Subscription({
      active: true,
      externalId: randomUUID(),
      planId: newPlan.id,
      planStatus: 'active',
      value: 100,
      userId: newUser.id,
    });

    newUser.subscriptionId = newSubscription.id;
    newUser.saveSubscription(newSubscription);

    await planRepository.create(newPlan);
    await userRepository.create(newUser);
    await subRepository.create(newSubscription);

    const { clientSecret } = await usecase.execute({
      userId: newUser.id,
    });

    expect(clientSecret).toBeTruthy();
  });
});
