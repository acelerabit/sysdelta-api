import { IsNotEmpty } from 'class-validator';

export class CreateOrderDayBody {
  @IsNotEmpty()
  summary: string;
}
