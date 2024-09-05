import { LegislativeMattersRepository } from '@/application/repositories/legislative-matter-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface RequestLegislativeMatterProps {
  legislativeMatterId: string;
}

@Injectable()
export class DeleteLegislativeMatter {
  constructor(
    private legislativeMattersRepository: LegislativeMattersRepository,
  ) {}

  async execute(data: RequestLegislativeMatterProps): Promise<void> {
    const { legislativeMatterId } = data;

    const legislativeMatterFound =
      await this.legislativeMattersRepository.findById(legislativeMatterId);

    if (!legislativeMatterFound) {
      throw new BadRequestException('Matéria legislativa não encontrada', {
        cause: new Error('Matéria legislativa não encontrada'),
        description: 'Matéria legislativa não encontrada',
      });
    }

    await this.legislativeMattersRepository.delete(legislativeMatterId);

    return;
  }
}
