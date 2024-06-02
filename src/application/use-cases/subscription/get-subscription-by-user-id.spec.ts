import { randomUUID } from 'crypto';
import { Subscription } from 'src/application/entities/subscription';
import { User } from 'src/application/entities/user';
import { InMemorySubscriptionRepository } from 'test/repositories/subscription/in-memory-subscription-repository';
import { InMemoryUsersRepository } from 'test/repositories/user/in-memory-user-repository';
import { GetUserSubscription } from './get-subscription-by-user-id';

describe('Get subscription by user id', () => {
  it('should be able to get subscription by user id', async () => {
    const userRepository = new InMemoryUsersRepository();
    const subsRepository = new InMemorySubscriptionRepository(userRepository);

    const usecase = new GetUserSubscription(subsRepository);

    const newUser = new User({
      email: 'email@test.com',
      name: 'user test',
      password: '123',
      role: 'ADMIN',
      createdAt: new Date(),
    });

    await userRepository.create(newUser);

    const newSubscription = new Subscription({
      active: true,
      externalId: randomUUID(),
      planId: randomUUID(),
      planStatus: 'active',
      value: 100,
      userId: newUser.id,
    });

    await subsRepository.create(newSubscription);

    const { subscription } = await usecase.execute({ userId: newUser.id });

    expect(subscription.id).toEqual(newSubscription.id);
  });
});
