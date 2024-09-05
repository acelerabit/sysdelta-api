import { IsNotEmpty } from 'class-validator';

export class UpdateOrderDayBody {
  @IsNotEmpty()
  summary: string;

  @IsNotEmpty()
  orderDayId: string;
}
