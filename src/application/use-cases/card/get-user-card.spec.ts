import { randomUUID } from 'crypto';
import { Subscription } from 'src/application/entities/subscription';
import { User } from 'src/application/entities/user';
import { InMemorySubscriptionRepository } from 'test/repositories/subscription/in-memory-subscription-repository';
import { InMemoryUsersRepository } from 'test/repositories/user/in-memory-user-repository';
import { GetUserCard } from './get-user-card';
import { vi } from 'vitest';

describe('Get user card information', () => {
  const mock = vi.fn().mockImplementation(() => {
    return {
      retrievePaymentMethod: vi.fn().mockReturnValue({
        paymentMethod: {
          billing_details: {
            name: 'Test name',
          },
          card: {
            last4: '4242',
            exp_year: 22,
            exp_month: '07',
          },
        },
      }),
    };
  });
  it('Should be able to get user card info', async () => {
    const userRepository = new InMemoryUsersRepository();
    const subRepository = new InMemorySubscriptionRepository(userRepository);
    const stripeServiceMock = mock();
    const usecase = new GetUserCard(
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

    const newSubscription = new Subscription({
      active: true,
      externalId: randomUUID(),
      planId: randomUUID(),
      planStatus: 'active',
      value: 100,
      userId: newUser.id,
      paymentMethodId: randomUUID(),
    });

    newUser.subscriptionId = newSubscription.id;
    newUser.saveSubscription(newSubscription);

    await userRepository.create(newUser);

    await subRepository.create(newSubscription);

    const { card } = await usecase.execute({ userId: newUser.id });

    expect(card.lastNumbers).toHaveLength(4);
    expect(card.expYear).toBeTruthy();
    expect(card.expMonth).toBeTruthy();
  });
});
