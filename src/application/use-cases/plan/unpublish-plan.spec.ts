import { randomUUID } from 'crypto';
import { Plan } from 'src/application/entities/plan';
import { InMemoryPlanRepository } from 'test/repositories/plan/in-memory-plan-repository';
import { UnpublishPlan } from './unpublish-plan';

describe('Publish Plan usecase', () => {
  it('Should be able to publish a plan', async () => {
    const inMemoryPlanRepository = new InMemoryPlanRepository();
    const usecase = new UnpublishPlan(inMemoryPlanRepository);

    const newPlan = new Plan({
      active: false,
      externalId: randomUUID(),
      name: 'Basic',
      priceExternalId: randomUUID(),
      value: 1000,
      interval: 'month',
      durationInMonths: 1,
      public: true,
    });

    await inMemoryPlanRepository.create(newPlan);

    const { plan } = await usecase.execute({ id: newPlan.id });

    expect(plan.public).toEqual(false);
  });
});
