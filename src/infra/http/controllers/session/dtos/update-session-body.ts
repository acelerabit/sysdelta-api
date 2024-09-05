import { SessionStatus, SessionTypes } from '@/application/entities/session';
import { IsNotEmpty } from 'class-validator';

export class UpdateSessionBody {
  @IsNotEmpty()
  legislature: string;

  @IsNotEmpty()
  legislativeSession: string;

  @IsNotEmpty()
  type: SessionTypes;

  @IsNotEmpty()
  numberSession: number;

  @IsNotEmpty()
  openingDateTime: Date;

  @IsNotEmpty()
  closingDateTime: Date;

  @IsNotEmpty()
  sessionStatus: SessionStatus;

  @IsNotEmpty()
  cityCouncilId: string;
}
