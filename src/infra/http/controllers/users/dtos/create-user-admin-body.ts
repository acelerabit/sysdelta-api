import { IsNotEmpty } from 'class-validator';

export class CreateUserAdminBody {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;
}
