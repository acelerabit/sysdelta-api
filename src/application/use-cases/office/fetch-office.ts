import { PaginationParams } from '@/@shared/pagination-interface';
import { Office } from '@/application/entities/office';
import { OfficesRepository } from '@/application/repositories/office-repository';
import { Injectable } from '@nestjs/common';

interface RequestOfficeProps {
  sessionId: string;
  pagination: PaginationParams;
}

interface ResponseOfficeProps {
  offices: Office[];
}

@Injectable()
export class FetchOffice {
  constructor(private officesRepository: OfficesRepository) {}

  async execute(data: RequestOfficeProps): Promise<ResponseOfficeProps> {
    const { sessionId, pagination } = data;

    const offices = await this.officesRepository.fetchBySessionId(
      sessionId,
      pagination,
    );

    return { offices };
  }
}
