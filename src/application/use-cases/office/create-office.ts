import { Office } from '@/application/entities/office';
import { OfficesRepository } from '@/application/repositories/office-repository';
import { Injectable } from '@nestjs/common';

interface RequestOfficeProps {
  summary: string;
  sessionId: string;
}

interface ResponseOfficeProps {
  office: Office;
}

@Injectable()
export class CreateOffice {
  constructor(private officesRepository: OfficesRepository) {}

  async execute(data: RequestOfficeProps): Promise<ResponseOfficeProps> {
    const { summary, sessionId } = data;

    const office = Office.create({
      summary,
      sessionId,
    });

    await this.officesRepository.create(office);

    return { office };
  }
}
