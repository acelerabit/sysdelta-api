import { randomUUID } from 'crypto';
import { Plan } from 'src/application/entities/plan';
import { InMemoryPlanRepository } from 'test/repositories/plan/in-memory-plan-repository';
import { FetchPlans } from './fetch-plans';

describe('Fetch Plans usecase', () => {
  it('Should be able to fetch all plans', async () => {
    const inMemoryPlanRepository = new InMemoryPlanRepository();
    const usecase = new FetchPlans(inMemoryPlanRepository);

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

    const newPlan2 = new Plan({
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

    await inMemoryPlanRepository.create(newPlan);
    await inMemoryPlanRepository.create(newPlan2);

    const { plans } = await usecase.execute();

    expect(plans).toHaveLength(2);
  });
});
