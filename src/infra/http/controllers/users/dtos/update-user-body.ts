import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserBody {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  role: 'ADMIN' | 'SECRETARY' | 'COUNCILOR' | 'ASSISTANT' | 'PRESIDENT';

  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsNotEmpty()
  acceptNotifications: boolean;

  @IsOptional()
  cpf: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  politicalParty: string;
}
