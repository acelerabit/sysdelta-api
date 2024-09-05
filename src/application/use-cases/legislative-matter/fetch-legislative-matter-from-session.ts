import { PaginationParams } from '@/@shared/pagination-interface';
import { LegislativeMatter } from '@/application/entities/legislative-matter';
import { LegislativeMattersRepository } from '@/application/repositories/legislative-matter-repository';
import { Injectable } from '@nestjs/common';

interface RequestLegislativeMatterProps {
  sessionId: string;
  pagination: PaginationParams;
  from?: string;
}

interface ResponseLegislativeMatterProps {
  legislativeMatters: LegislativeMatter[];
}

@Injectable()
export class FetchLegislativeMatterFromSession {
  constructor(
    private legislativeMattersRepository: LegislativeMattersRepository,
  ) {}

  async execute(
    data: RequestLegislativeMatterProps,
  ): Promise<ResponseLegislativeMatterProps> {
    const { sessionId, pagination, from } = data;

    const legislativeMatters =
      await this.legislativeMattersRepository.fetchBySessionId(
        sessionId,
        pagination,
        from,
      );

    return { legislativeMatters };
  }
}
