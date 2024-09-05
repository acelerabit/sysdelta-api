import { PaginationParams } from '@/@shared/pagination-interface';
import { Session } from '@/application/entities/session';
import { SessionsRepository } from '@/application/repositories/session-repository';
import { Injectable } from '@nestjs/common';

interface RequestSessionProps {
  cityCouncilId: string;
  pagination: PaginationParams;
}

interface ResponseSessionProps {
  sessions: Session[];
}

@Injectable()
export class FetchSession {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(data: RequestSessionProps): Promise<ResponseSessionProps> {
    const { cityCouncilId, pagination } = data;

    const sessions = await this.sessionsRepository.fetchByCityCouncilId(
      cityCouncilId,
      pagination,
    );

    return { sessions };
  }
}
