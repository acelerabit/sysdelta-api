import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCityCouncilBody {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  cnpj: string;

  @IsNotEmpty()
  @IsOptional()
  city: string;

  @IsNotEmpty()
  @IsOptional()
  state: string;
}
