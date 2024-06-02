import { IsNotEmpty } from 'class-validator';

export class UpdatePlanBody {
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  durationInMonths: number;

  trialDays: number;
}
