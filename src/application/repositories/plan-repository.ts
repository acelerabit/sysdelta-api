import { Plan } from '../entities/plan';

export interface UpdatePriceData {
  id: string;
  price: number;
  priceExternalId: string;
}

export abstract class PlanRepository {
  abstract create(plan: Plan): Promise<void>;
  abstract findAll({
    active,
    withTrial,
    publicPlan,
    free,
  }: {
    active?: boolean;
    withTrial?: boolean;
    publicPlan?: boolean;
    free?: boolean;
  }): Promise<Plan[]>;
  abstract findAllAvailablePlans(): Promise<Plan[]>;
  abstract findById(id: string): Promise<Plan | null>;
  abstract findByDefault(): Promise<Plan | null>;
  abstract findFreePlan(): Promise<Plan | null>;
  abstract publishPlan(id: string): Promise<void>;
  abstract turnPlanDefault(id: string): Promise<void>;
  abstract unpublishPlan(id: string): Promise<void>;
  abstract activatePlan(id: string): Promise<void>;
  abstract deactivatePlan(id: string): Promise<void>;
  abstract update(plan: Plan): Promise<void>;
  abstract delete(planId: string): Promise<void>;
}
