import { Office } from '@/application/entities/office';
import { OfficesRepository } from '@/application/repositories/office-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface RequestOfficeProps {
  officeId: string;
}

interface ResponseOfficeProps {
  office: Office;
}

@Injectable()
export class GetOffice {
  constructor(private officesRepository: OfficesRepository) {}

  async execute(data: RequestOfficeProps): Promise<ResponseOfficeProps> {
    const { officeId } = data;

    const officeFound = await this.officesRepository.findById(officeId);

    if (!officeFound) {
      throw new BadRequestException('Dados de expediente não encontrado', {
        cause: new Error('Dados de expediente não encontrado'),
        description: 'Dados de expediente não encontrado',
      });
    }

    return { office: officeFound };
  }
}
