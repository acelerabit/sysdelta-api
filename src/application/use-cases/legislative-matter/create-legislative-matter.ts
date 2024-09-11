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
  votingType?: VotingType;
  sessionId?: string;
  authors: string;
  officeId?: string;
  orderDayId?: string;
  cityCouncilId?: string;
}

interface ResponseLegislativeMatterProps {
  legislativeMatter: LegislativeMatter;
}

@Injectable()
export class CreateLegislativeMatter {
  constructor(
    private legislativeMattersRepository: LegislativeMattersRepository,
  ) {}

  async execute(
    data: RequestLegislativeMatterProps,
  ): Promise<ResponseLegislativeMatterProps> {
    const legislativeMatterExist =
      await this.legislativeMattersRepository.findByCode(data.code);

    if (legislativeMatterExist) {
      throw new BadRequestException('Já existe uma matéria com esse código', {
        cause: new Error('Já existe uma matéria com esse código'),
        description: 'Já existe uma matéria com esse código',
      });
    }

    const legislativeMatter = LegislativeMatter.create({
      ...data,
    });

    await this.legislativeMattersRepository.create(legislativeMatter);

    return { legislativeMatter };
  }
}
