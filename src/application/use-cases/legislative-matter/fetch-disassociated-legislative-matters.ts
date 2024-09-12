import { PaginationParams } from '@/@shared/pagination-interface';
import { LegislativeMatter } from '@/application/entities/legislative-matter';
import { LegislativeMattersRepository } from '@/application/repositories/legislative-matter-repository';
import { Injectable } from '@nestjs/common';

interface RequestLegislativeMatterProps {
  cityCouncilId: string;
}

interface ResponseLegislativeMatterProps {
  legislativeMatters: LegislativeMatter[];
}

@Injectable()
export class FetchDisassociatedLegislativeMatters {
  constructor(
    private legislativeMattersRepository: LegislativeMattersRepository,
  ) {}

  async execute(
    data: RequestLegislativeMatterProps,
  ): Promise<ResponseLegislativeMatterProps> {
    const { cityCouncilId } = data;

    const legislativeMatters =
      await this.legislativeMattersRepository.findAllDisassociated(
        cityCouncilId,
      );

    return { legislativeMatters };
  }
}
