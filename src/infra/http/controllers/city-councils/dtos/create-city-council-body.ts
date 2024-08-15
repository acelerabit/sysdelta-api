import { IsNotEmpty } from 'class-validator';

export class CreateCityCouncilBody {
  @IsNotEmpty()
  name: string;
}
