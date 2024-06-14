import { randomUUID } from 'crypto';
import { Plan } from 'src/application/entities/plan';
import { InMemoryPlanRepository } from 'test/repositories/plan/in-memory-plan-repository';
import { DeactivatePlan } from './deactive-plan';
import { vi } from 'vitest';

describe('Deactive Plan usecase', () => {
  const mock = vi.fn().mockImplementation(() => {
    return {
      inactivePlan: vi.fn(),
    };
  });

  it('Should be able to deactive a plan', async () => {
    const inMemoryPlanRepository = new InMemoryPlanRepository();
    const stripeServiceMock = mock();
    const usecase = new DeactivatePlan(
      inMemoryPlanRepository,
      stripeServiceMock,
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
    });

    await inMemoryPlanRepository.create(newPlan);

    const { plan } = await usecase.execute({ id: newPlan.id });

    expect(plan.active).toEqual(false);
  });
});
