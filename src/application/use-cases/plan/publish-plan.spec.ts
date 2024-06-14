import { randomUUID } from 'crypto';
import { Plan } from 'src/application/entities/plan';
import { InMemoryPlanRepository } from 'test/repositories/plan/in-memory-plan-repository';
import { PublishPlan } from './publish-plan';

describe('Publish Plan usecase', () => {
  it('Should be able to publish a plan', async () => {
    const inMemoryPlanRepository = new InMemoryPlanRepository();
    const usecase = new PublishPlan(inMemoryPlanRepository);

    const newPlan = new Plan({
      active: true,
      externalId: randomUUID(),
      name: 'Basic',
      priceExternalId: randomUUID(),
      value: 1000,
      interval: 'month',
      durationInMonths: 1,
      public: false,
    });

    await inMemoryPlanRepository.create(newPlan);

    const { plan } = await usecase.execute({ id: newPlan.id });

    expect(plan.public).toEqual(true);
  });
});
