import {
  LegislativeMatter,
  Status,
  VotingType,
} from '@/application/entities/legislative-matter';
import { LegislativeMattersRepository } from '@/application/repositories/legislative-matter-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface RequestLegislativeMatterProps {
  type: string;
  summary: string;
  presentationDate: Date;
  code: string;
  title: string;
  votingType: VotingType;
  status: Status;
  authors: string;
  legislativeMatterId: string;
}

@Injectable()
export class UpdateLegislativeMatter {
  constructor(
    private legislativeMattersRepository: LegislativeMattersRepository,
  ) {}

  async execute(data: RequestLegislativeMatterProps): Promise<void> {
    const {
      summary,
      legislativeMatterId,
      authors,
      presentationDate,
      status,
      title,
      type,
      votingType,
    } = data;

    const legislativeMatterFound =
      await this.legislativeMattersRepository.findById(legislativeMatterId);

    if (!legislativeMatterFound) {
      throw new BadRequestException('Sessão não encontrada', {
        cause: new Error('Sessão não encontrada'),
        description: 'Sessão não encontrada',
      });
    }

    const updates: Partial<LegislativeMatter> = {};

    if (summary) {
      updates.summary = summary;
    }

    if (authors) {
      updates.authors = authors;
    }

    if (presentationDate) {
      updates.presentationDate = presentationDate;
    }

    if (status) {
      updates.status = status;
    }

    if (title) {
      updates.title = title;
    }

    if (type) {
      updates.type = type;
    }

    if (votingType) {
      updates.votingType = votingType;
    }

    updates.updatedAt = new Date();

    Object.assign(legislativeMatterFound, updates);

    await this.legislativeMattersRepository.update(legislativeMatterFound);

    return;
  }
}
