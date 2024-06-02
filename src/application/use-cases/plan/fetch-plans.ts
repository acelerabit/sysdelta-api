import { PlanRepository } from '@/application/repositories/plan-repository';
import { Injectable } from '@nestjs/common';
import { Plan } from 'src/application/entities/plan';

interface FetchPlansResponse {
  plans: Plan[];
}

@Injectable()
export class FetchPlans {
  constructor(private planRepository: PlanRepository) {}

  async execute(): Promise<FetchPlansResponse> {
    const plans = await this.planRepository.findAll({});

    return { plans };
  }
}
