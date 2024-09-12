import { LegislativeMattersRepository } from '@/application/repositories/legislative-matter-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface RequestLegislativeMatterProps {
  sessionId: string;
  phase: string;
  officeId?: string;
  orderDayId?: string;
  legislativeMatterId: string;
}

@Injectable()
export class AssociateLegislativeMatter {
  constructor(
    private legislativeMattersRepository: LegislativeMattersRepository,
  ) {}

  async execute(data: RequestLegislativeMatterProps): Promise<void> {
    const { sessionId, legislativeMatterId, phase, officeId, orderDayId } =
      data;

    const legislativeMatterFound =
      await this.legislativeMattersRepository.findById(legislativeMatterId);

    if (!legislativeMatterFound) {
      throw new BadRequestException('Matéria não encontrada', {
        cause: new Error('Matéria não encontrada'),
        description: 'Matéria não encontrada',
      });
    }

    if (phase == 'expedient') {
      legislativeMatterFound.officeId = officeId;
      legislativeMatterFound.sessionId = sessionId;

      await this.legislativeMattersRepository.update(legislativeMatterFound);

      return;
    }

    legislativeMatterFound.orderDayId = orderDayId;
    legislativeMatterFound.sessionId = sessionId;

    await this.legislativeMattersRepository.update(legislativeMatterFound);

    return;
  }
}
