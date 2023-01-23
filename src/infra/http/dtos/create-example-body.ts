import { IsNotEmpty } from 'class-validator';

export class CreateExampleBody {
  @IsNotEmpty()
  content: string;
}
