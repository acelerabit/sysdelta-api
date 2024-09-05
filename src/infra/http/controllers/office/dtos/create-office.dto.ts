import { IsNotEmpty } from 'class-validator';

export class CreateOfficeBody {
  @IsNotEmpty()
  summary: string;
}
