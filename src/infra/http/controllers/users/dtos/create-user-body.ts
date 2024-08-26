import { IsNotEmpty } from 'class-validator';

export class CreateUserBody {
  @IsNotEmpty()
  cityCouncilId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  role: 'ADMIN' | 'PRESIDENT' | 'COUNCILOR' | 'SECRETARY' | 'ASSISTANT';

  @IsNotEmpty()
  cpf: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  politicalParty: string;
}
