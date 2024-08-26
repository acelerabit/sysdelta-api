import { IsNotEmpty } from 'class-validator';

export class CreateCityCouncilBody {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  cnpj: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  state: string;
}
