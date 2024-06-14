import { randomUUID } from 'crypto';
import { Plan } from 'src/application/entities/plan';
import { InMemoryPlanRepository } from 'test/repositories/plan/in-memory-plan-repository';
import { ActivePlan } from './active-plan';
import { vi } from 'vitest';

describe('Active Plan usecase', () => {
  const mock = vi.fn().mockImplementation(() => {
    return {
      activatePlan: vi.fn(),
    };
  });

  it('Should be able to active a plan', async () => {
    const inMemoryPlanRepository = new InMemoryPlanRepository();
    const stripeServiceMock = mock();
    const usecase = new ActivePlan(inMemoryPlanRepository, stripeServiceMock);

    const newPlan = new Plan({
      active: false,
      externalId: randomUUID(),
      name: 'Basic',
      interval: 'month',
      priceExternalId: randomUUID(),
      value: 1000,
      durationInMonths: 1,
      public: false,
    });

    await inMemoryPlanRepository.create(newPlan);

    const { plan } = await usecase.execute({ id: newPlan.id });

    expect(plan.active).toEqual(true);
  });
});
