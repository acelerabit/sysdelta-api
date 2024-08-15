import { IsNotEmpty } from 'class-validator';

export class UpdateCityCouncilBody {
  @IsNotEmpty()
  name: string;
}
