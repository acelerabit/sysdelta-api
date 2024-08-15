import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserBody {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsNotEmpty()
  role: 'ADMIN' | 'PRESIDENT' | 'COUNCILOR' | 'SECRETARY' | 'ASSISTANT';

  @IsOptional()
  @IsNotEmpty()
  acceptNotifications: boolean;
}
