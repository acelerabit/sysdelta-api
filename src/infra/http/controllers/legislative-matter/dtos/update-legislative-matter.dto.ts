import { Status, VotingType } from '@/application/entities/legislative-matter';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateLegislativeMatterBody {
  @IsNotEmpty()
  @IsOptional()
  type: string;

  @IsNotEmpty()
  @IsOptional()
  summary: string;

  @IsNotEmpty()
  @IsOptional()
  presentationDate: Date;

  @IsNotEmpty()
  @IsOptional()
  code: number;

  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsNotEmpty()
  @IsOptional()
  votingType: VotingType;

  @IsNotEmpty()
  @IsOptional()
  status: Status;

  @IsNotEmpty()
  @IsOptional()
  authorId: string;
}
