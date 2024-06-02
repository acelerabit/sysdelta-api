import { randomUUID } from 'crypto';
import { InMemoryPlanRepository } from 'test/repositories/plan/in-memory-plan-repository';
import { CreatePlan } from './create-plan';
import { vi } from 'vitest';

describe('Create Plan usecase', () => {
  const mock = vi.fn().mockImplementation(() => {
    return {
      createProduct: vi.fn().mockReturnValue({
        active: false,
        id: randomUUID(),
        name: 'Basic',
        default_price: randomUUID(),
      }),
      retrievePrice: vi.fn().mockReturnValue({
        recurring: { interval: 'month' },
        id: randomUUID(),
        unit_amount: 1000,
      }),
    };
  });

  it('Should be able to create a plan', async () => {
    const inMemoryPlanRepository = new InMemoryPlanRepository();
    const stripeServiceMock = mock();
    const usecase = new CreatePlan(inMemoryPlanRepository, stripeServiceMock);

    const { plan } = await usecase.execute({
      name: 'Basic',
      value: 1000,
      durationInMonths: 1,
      qtdReports: 10,
      canIntegrate: true,
      qtdProjects: 1,
    });

    expect(plan.id).toBeDefined();
    expect(plan.name).toEqual('Basic');
    expect(plan.value).toEqual(1000);
    expect(plan.active).toEqual(false);
    expect(plan.externalId).toEqual(expect.any(String));
    expect(plan.priceExternalId).toEqual(expect.any(String));
  });
});
