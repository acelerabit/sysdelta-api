import { randomUUID } from 'crypto';
import { Plan } from 'src/application/entities/plan';
import { InMemoryPlanRepository } from 'test/repositories/plan/in-memory-plan-repository';
import { FetchPlansWithTrialPeriod } from './fetch-trial-plans';

describe('Fetch Plans with trial period usecase', () => {
  it('Should be able to fetch all plans with trial periods', async () => {
    const inMemoryPlanRepository = new InMemoryPlanRepository();
    const usecase = new FetchPlansWithTrialPeriod(inMemoryPlanRepository);

    const newPlan = new Plan({
      active: true,
      externalId: randomUUID(),
      name: 'Basic',
      interval: 'month',
      priceExternalId: randomUUID(),
      value: 1000,
      durationInMonths: 1,
      trialDays: 0,
      public: true,
    });

    const newPlan2 = new Plan({
      active: false,
      externalId: randomUUID(),
      name: 'Basic',
      priceExternalId: randomUUID(),
      value: 1000,
      interval: 'month',
      durationInMonths: 1,
      trialDays: 20,
      public: false,
    });

    const newPlan3 = new Plan({
      active: true,
      externalId: randomUUID(),
      name: 'Basic',
      priceExternalId: randomUUID(),
      value: 1000,
      interval: 'month',
      durationInMonths: 1,
      trialDays: 20,
      public: false,
    });

    await inMemoryPlanRepository.create(newPlan);
    await inMemoryPlanRepository.create(newPlan2);
    await inMemoryPlanRepository.create(newPlan3);

    const { plans } = await usecase.execute();

    expect(plans).toHaveLength(1);
  });
});
