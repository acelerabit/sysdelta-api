import { Status, VotingType } from '@/application/entities/legislative-matter';
import { IsNotEmpty } from 'class-validator';

export class CreateLegislativeMatterBody {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  summary: string;

  @IsNotEmpty()
  presentationDate: Date;

  @IsNotEmpty()
  code: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  votingType: VotingType;

  @IsNotEmpty()
  authorId: string;
}
