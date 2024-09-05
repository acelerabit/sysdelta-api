import { Office } from '@/application/entities/office';
import { OfficesRepository } from '@/application/repositories/office-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface RequestOfficeProps {
  summary: string;
  officeId: string;
}

@Injectable()
export class UpdateOffice {
  constructor(private officesRepository: OfficesRepository) {}

  async execute(data: RequestOfficeProps): Promise<void> {
    const { summary, officeId } = data;

    const officeFound = await this.officesRepository.findById(officeId);

    if (!officeFound) {
      throw new BadRequestException('Sessão não encontrada', {
        cause: new Error('Sessão não encontrada'),
        description: 'Sessão não encontrada',
      });
    }

    const updates: Partial<Office> = {};

    if (summary) {
      updates.summary = summary;
    }

    updates.updatedAt = new Date();

    Object.assign(officeFound, updates);

    await this.officesRepository.update(officeFound);

    return;
  }
}
