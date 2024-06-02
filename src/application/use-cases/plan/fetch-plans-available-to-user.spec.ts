import { randomUUID } from 'crypto';
import { Plan } from 'src/application/entities/plan';
import { Subscription } from 'src/application/entities/subscription';
import { User } from 'src/application/entities/user';
import { InMemoryPlanRepository } from 'test/repositories/plan/in-memory-plan-repository';
import { InMemorySubscriptionRepository } from 'test/repositories/subscription/in-memory-subscription-repository';
import { InMemoryUsersRepository } from 'test/repositories/user/in-memory-user-repository';
import { FetchPlansAvailableToUser } from './fetch-plans-available-to-user';

describe('Fetch plans available to user usecase', () => {
  it('should be able to fetch all plans available to user when he has a payment method save', async () => {
    const planRepository = new InMemoryPlanRepository();
    const userRepository = new InMemoryUsersRepository();
    const subRepository = new InMemorySubscriptionRepository(userRepository);

    const usecase = new FetchPlansAvailableToUser(
      planRepository,
      userRepository,
      subRepository,
    );

    const newPlan = new Plan({
      active: true,
      externalId: randomUUID(),
      name: 'Basic',
      interval: 'month',
      priceExternalId: randomUUID(),
      value: 1000,
      durationInMonths: 1,
      public: false,
      qtdReports: 10,
      canIntegrate: false,
      qtdProjects: 1,
    });

    const newPlanWithTrial = new Plan({
      active: true,
      externalId: randomUUID(),
      name: 'Basic',
      interval: 'month',
      priceExternalId: randomUUID(),
      value: 1000,
      durationInMonths: 1,
      public: false,
      qtdReports: 10,
      canIntegrate: false,
      qtdProjects: 1,
      trialDays: 10,
    });

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

    await planRepository.create(newPlan);
    await planRepository.create(newPlanWithTrial);
    await subRepository.create(newSubscription);

    await userRepository.create(newUser);

    const { plans } = await usecase.execute({ userId: newUser.id });

    expect(plans).toHaveLength(2);
  });

  it('should be able to fetch all plans available to user when he does´t a payment method save', async () => {
    const planRepository = new InMemoryPlanRepository();
    const userRepository = new InMemoryUsersRepository();
    const subRepository = new InMemorySubscriptionRepository(userRepository);

    const usecase = new FetchPlansAvailableToUser(
      planRepository,
      userRepository,
      subRepository,
    );

    const newPlan = new Plan({
      active: true,
      externalId: randomUUID(),
      name: 'Basic',
      interval: 'month',
      priceExternalId: randomUUID(),
      value: 1000,
      durationInMonths: 1,
      public: false,
      qtdReports: 10,
      canIntegrate: false,
      qtdProjects: 1,
    });

    const newPlanWithTrial = new Plan({
      active: true,
      externalId: randomUUID(),
      name: 'Basic',
      interval: 'month',
      priceExternalId: randomUUID(),
      value: 1000,
      durationInMonths: 1,
      public: false,
      qtdReports: 10,
      canIntegrate: false,
      qtdProjects: 1,
      trialDays: 10,
    });

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
    });

    newUser.subscriptionId = newSubscription.id;
    newUser.saveSubscription(newSubscription);

    await planRepository.create(newPlan);
    await planRepository.create(newPlanWithTrial);
    await subRepository.create(newSubscription);
    await userRepository.create(newUser);

    const { plans } = await usecase.execute({ userId: newUser.id });

    expect(plans).toHaveLength(1);
    expect(plans[0].id).toEqual(newPlanWithTrial.id);
  });
});
