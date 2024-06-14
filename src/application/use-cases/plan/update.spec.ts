import { randomUUID } from 'crypto';
import { Plan } from 'src/application/entities/plan';
import { InMemoryPlanRepository } from 'test/repositories/plan/in-memory-plan-repository';
import { UpdatePlan } from './update';
import { vi } from 'vitest';

describe('Update price plan usecase', () => {
  const mock = vi.fn().mockImplementation(() => {
    return {
      createPrice: vi.fn().mockReturnValue({
        id: randomUUID(),
      }),
      updateProductPrice: vi.fn().mockReturnValue({
        name: 'TESTE 2',
      }),
      retrievePrice: vi.fn().mockReturnValue({
        recurring: { interval: 'month', interval_count: 2 },
        id: randomUUID(),
        unit_amount: 2000,
      }),
    };
  });
  it('Should be able to update price of a plan', async () => {
    const inMemoryPlanRepository = new InMemoryPlanRepository();
    const stripeServiceMock = mock();
    const usecase = new UpdatePlan(inMemoryPlanRepository, stripeServiceMock);

    const newPlan = new Plan({
      active: false,
      externalId: randomUUID(),
      name: 'Basic',
      priceExternalId: randomUUID(),
      value: 1000,
      interval: 'month',
      durationInMonths: 1,
      public: false,
    });

    await inMemoryPlanRepository.create(newPlan);

    const { plan } = await usecase.execute({
      id: newPlan.id,
      price: 2000,
      durationInMonths: 2,
      trialDays: 10,
      name: 'TESTE 2',
    });

    expect(plan.id).toBeDefined();
    expect(plan.name).toEqual('TESTE 2');
    expect(plan.value).toEqual(2000);
    expect(plan.active).toEqual(false);
    expect(plan.externalId).toEqual(expect.any(String));
    expect(plan.priceExternalId).toEqual(expect.any(String));
    expect(plan.durationInMonths).toEqual(2);
  });
});
