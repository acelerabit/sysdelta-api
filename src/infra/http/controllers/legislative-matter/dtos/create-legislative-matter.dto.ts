import { Status, VotingType } from '@/application/entities/legislative-matter';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLegislativeMatterBody {
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  summary: string;

  @IsNotEmpty()
  presentationDate: Date;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsOptional()
  votingType?: VotingType;

  @IsNotEmpty()
  authors: string;
}
