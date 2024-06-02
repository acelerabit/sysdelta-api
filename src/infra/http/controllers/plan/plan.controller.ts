import { ActivePlan } from '@/application/use-cases/plan/active-plan';
import { CreatePlan } from '@/application/use-cases/plan/create-plan';
import { DeactivatePlan } from '@/application/use-cases/plan/deactive-plan';
import { PublishPlan } from '@/application/use-cases/plan/publish-plan';
import { UnpublishPlan } from '@/application/use-cases/plan/unpublish-plan';
import { UpdatePlan } from '@/application/use-cases/plan/update';
import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Body,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { DeletePlan } from 'src/application/use-cases/plan/delete-plan';
import { FetchPlans } from 'src/application/use-cases/plan/fetch-plans';
import { FetchPlansAvailableToUpgrade } from 'src/application/use-cases/plan/fetch-plans-available-to-upgrade';
import { FetchPlansAvailableToUser } from 'src/application/use-cases/plan/fetch-plans-available-to-user';
import { GetDefaultPlan } from 'src/application/use-cases/plan/get-default-plan';
import { TurnPlanDefault } from 'src/application/use-cases/plan/turn-plan-default';
import { Auth } from 'src/infra/decorators/auth.decorator';
import { CreatePlanBody } from './dtos/create-plan-body';
import { UpdatePlanBody } from './dtos/update-plan-body';

@Controller('plans')
export class PlanController {
  constructor(
    private fetchPlansAvailableToUser: FetchPlansAvailableToUser,
    private fetchPlansAvailableToUpgrade: FetchPlansAvailableToUpgrade,
    private fetchPlans: FetchPlans,
    private deletePlan: DeletePlan,
    private turnPlanDefault: TurnPlanDefault,
    private getDefaultPlan: GetDefaultPlan,
    private createPlan: CreatePlan,
    private deactivatePlan: DeactivatePlan,
    private activePlan: ActivePlan,
    private updatePlan: UpdatePlan,
    private publishPlan: PublishPlan,
    private unpublishPlan: UnpublishPlan,
  ) {}

  @Auth(Role.ADMIN)
  @Post('/create/plan')
  async create(@Body() body: CreatePlanBody): Promise<any> {
    const { name, value, durationInMonths, trialDays } = body;

    await this.createPlan.execute({
      name,
      value,
      durationInMonths,
      trialDays,
    });

    return;
  }

  @Get('/fetch/available-to/:userId')
  async fetchPlansAvailable(@Param('userId') userId: string) {
    const { plans } = await this.fetchPlansAvailableToUser.execute({
      userId,
    });

    return plans.map((plan) => {
      return {
        id: plan.id,
        name: plan.name,
        durationInMonths: plan.durationInMonths,
        value: plan.value,
      };
    });
  }

  @Auth(Role.ADMIN, Role.USER)
  @Get('/fetch')
  async fetch() {
    const { plans } = await this.fetchPlans.execute();

    return plans.map((plan) => {
      return {
        id: plan.id,
        active: plan.active,
        value: plan.value,
        durationInMonths: plan.durationInMonths,
        name: plan.name,
        trialDays: plan.trialDays,
      };
    });
  }

  @Auth(Role.ADMIN, Role.USER)
  @Get('/fetch/available-to-upgrade')
  async fetchAvailableToUp() {
    const { plans } = await this.fetchPlansAvailableToUpgrade.execute();

    return plans.map((plan) => {
      return {
        id: plan.id,
        active: plan.active,
        value: plan.value,
        durationInMonths: plan.durationInMonths,
        name: plan.name,
        trialDays: plan.trialDays,
      };
    });
  }

  @Auth(Role.ADMIN)
  @Get('/turn-default/:id')
  async turnDefault(@Param('id') id: string) {
    await this.turnPlanDefault.execute({
      id,
    });

    return;
  }

  @Get('/default')
  async getDefault() {
    const { plan } = await this.getDefaultPlan.execute();

    return {
      id: plan.id,
      active: plan.active,
      value: plan.value,
      durationInMonths: plan.durationInMonths,
      name: plan.name,
      trialDays: plan.trialDays,
    };
  }

  @Auth(Role.ADMIN)
  @Put('/update/plan/:planId')
  async update(@Param('planId') planId: string, @Body() body: UpdatePlanBody) {
    const { price, name, trialDays, durationInMonths } = body;

    const { plan } = await this.updatePlan.execute({
      id: planId,
      name,
      price,
      trialDays,
      durationInMonths,
    });

    return plan;
  }

  @Auth(Role.ADMIN)
  @Delete('/delete/:planId')
  async delete(@Param('planId') planId: string) {
    await this.deletePlan.execute({ id: planId });

    return;
  }

  @Auth(Role.ADMIN)
  @Get('/publish/plan/:productId')
  async publish(@Param('productId') productId: string): Promise<void> {
    await this.publishPlan.execute({ id: productId });

    return;
  }

  @Auth(Role.ADMIN)
  @Get('/unpublish/plan/:productId')
  async unpublish(@Param('productId') productId: string): Promise<void> {
    await this.unpublishPlan.execute({ id: productId });

    return;
  }

  @Auth(Role.ADMIN)
  @Get('/deactivate/plan/:productId')
  async deactivate(@Param('productId') productId: string): Promise<void> {
    await this.deactivatePlan.execute({ id: productId });

    return;
  }

  @Auth(Role.ADMIN)
  @Get('/activate/plan/:productId')
  async activate(@Param('productId') productId: string): Promise<void> {
    await this.activePlan.execute({ id: productId });

    return;
  }
}
