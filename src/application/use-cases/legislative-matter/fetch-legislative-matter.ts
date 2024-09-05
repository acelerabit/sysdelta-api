import { PaginationParams } from '@/@shared/pagination-interface';
import { LegislativeMatter } from '@/application/entities/legislative-matter';
import { LegislativeMattersRepository } from '@/application/repositories/legislative-matter-repository';
import { Injectable } from '@nestjs/common';

interface RequestLegislativeMatterProps {
  pagination: PaginationParams;
}

interface ResponseLegislativeMatterProps {
  legislativeMatters: LegislativeMatter[];
}

@Injectable()
export class FetchLegislativeMatter {
  constructor(
    private legislativeMattersRepository: LegislativeMattersRepository,
  ) {}

  async execute(
    data: RequestLegislativeMatterProps,
  ): Promise<ResponseLegislativeMatterProps> {
    const { pagination } = data;

    const legislativeMatters = await this.legislativeMattersRepository.findAll(
      pagination,
    );

    return { legislativeMatters };
  }
}
