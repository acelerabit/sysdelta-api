import { IsNotEmpty } from 'class-validator';

export class UpdateOfficeBody {
  @IsNotEmpty()
  summary: string;

  @IsNotEmpty()
  officeId: string;
}
