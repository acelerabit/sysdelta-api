import { LegislativeMatter } from '@/application/entities/legislative-matter';
import { LegislativeMattersRepository } from '@/application/repositories/legislative-matter-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface RequestLegislativeMatterProps {
  legislativeMatterId: string;
}

interface ResponseLegislativeMatterProps {
  legislativeMatter: LegislativeMatter;
}

@Injectable()
export class GetLegislativeMatter {
  constructor(
    private legislativeMattersRepository: LegislativeMattersRepository,
  ) {}

  async execute(
    data: RequestLegislativeMatterProps,
  ): Promise<ResponseLegislativeMatterProps> {
    const { legislativeMatterId } = data;

    const legislativeMatterFound =
      await this.legislativeMattersRepository.findById(legislativeMatterId);

    if (!legislativeMatterFound) {
      throw new BadRequestException('Matéria legislativa não encontrada', {
        cause: new Error('Matéria legislativa não encontrada'),
        description: 'Matéria legislativa não encontrada',
      });
    }

    return { legislativeMatter: legislativeMatterFound };
  }
}
