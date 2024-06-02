import { PlanRepository } from '@/application/repositories/plan-repository';
import { Injectable } from '@nestjs/common';
import { Plan } from 'src/application/entities/plan';

interface FetchPlansWithTrialPeriodResponse {
  plans: Plan[];
}

@Injectable()
export class FetchPlansWithTrialPeriod {
  constructor(private planRepository: PlanRepository) {}

  async execute(): Promise<FetchPlansWithTrialPeriodResponse> {
    const plans = await this.planRepository.findAllAvailablePlans();

    return { plans };
  }
}
