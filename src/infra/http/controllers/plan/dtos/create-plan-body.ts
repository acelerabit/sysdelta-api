import { IsNotEmpty } from 'class-validator';

export class CreatePlanBody {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  value: number;

  @IsNotEmpty()
  durationInMonths: number;

  trialDays: number;
}
