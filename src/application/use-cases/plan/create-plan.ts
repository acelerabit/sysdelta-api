import { PlanRepository } from '@/application/repositories/plan-repository';
import { BillingService } from '@/infra/billing/billing.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Plan } from 'src/application/entities/plan';

interface CreatePlanRequest {
  name: string;
  value: number;
  durationInMonths: number;
  trialDays?: number;
}

interface CreatePlanResponse {
  plan: Plan;
}

@Injectable()
export class CreatePlan {
  constructor(
    private planRepository: PlanRepository,
    private billingService: BillingService,
  ) {}

  async execute(data: CreatePlanRequest): Promise<CreatePlanResponse> {
    if (data.value <= 0) {
      const plan = new Plan({
        active: false,
        externalId: null,
        interval: 'month',
        name: data.name,
        priceExternalId: null,
        value: data.value,
        durationInMonths: data.durationInMonths,
        trialDays: data.trialDays ?? null,
        public: false,
      });

      await this.planRepository.create(plan);

      return { plan };
    }

    if (data.durationInMonths <= 0) {
      throw new BadRequestException(
        'Somente o plano free não precisa de tempo de duração',
        {
          cause: new Error('Tempo de duração inválido'),
          description: 'Tempo de duração inválido',
        },
      );
    }

    const planStripe = await this.billingService.createProduct({
      name: data.name,
      value: data.value,
      duration_months: data.durationInMonths,
    });

    if (!planStripe) {
      throw new BadRequestException('Não foi possivel criar o plano', {
        cause: new Error('Error ao criar plano no stripe'),
        description: 'Error ao criar plano no stripe',
      });
    }

    const price = await this.billingService.retrievePrice(
      planStripe.default_price.toString(),
    );

    if (!price) {
      throw new BadRequestException(
        'Não foi possivel encontrar o valor do plano',
        {
          cause: new Error('Erro ao recuperar o valor do plano no stripe'),
          description: 'Erro ao recuperar o valor do plano no stripe',
        },
      );
    }

    const plan = new Plan({
      active: planStripe.active,
      externalId: planStripe.id,
      interval: price.recurring.interval,
      name: planStripe.name,
      priceExternalId: price.id,
      value: price.unit_amount,
      durationInMonths: price.recurring.interval_count,
      trialDays: data.trialDays ?? null,
      public: false,
    });

    await this.planRepository.create(plan);

    return { plan };
  }
}
