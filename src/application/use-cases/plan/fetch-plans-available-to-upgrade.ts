import { PlanRepository } from '@/application/repositories/plan-repository';
import { Injectable } from '@nestjs/common';
import { Plan } from 'src/application/entities/plan';

interface FetchPlansAvailableToUpgradeResponse {
  plans: Plan[];
}

@Injectable()
export class FetchPlansAvailableToUpgrade {
  constructor(private planRepository: PlanRepository) {}

  async execute(): Promise<FetchPlansAvailableToUpgradeResponse> {
    const plans = await this.planRepository.findAll({
      active: true,
      publicPlan: true,
    });

    return { plans };
  }
}
