import { IsNotEmpty } from 'class-validator';

export class CreateUserBody {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: 'ADMIN' | 'PRESIDENT' | 'COUNCILOR' | 'SECRETARY' | 'ASSISTANT';
}
