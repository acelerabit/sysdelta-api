import { OfficesRepository } from '@/application/repositories/office-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface RequestOfficeProps {
  officeId: string;
}

@Injectable()
export class DeleteOffice {
  constructor(private officesRepository: OfficesRepository) {}

  async execute(data: RequestOfficeProps): Promise<void> {
    const { officeId } = data;

    const officeFound = await this.officesRepository.findById(officeId);

    if (!officeFound) {
      throw new BadRequestException('Sessão não encontrada', {
        cause: new Error('Sessão não encontrada'),
        description: 'Sessão não encontrada',
      });
    }

    await this.officesRepository.delete(officeId);

    return;
  }
}
