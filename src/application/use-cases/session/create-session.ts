import {
  Session,
  SessionStatus,
  SessionTypes,
} from '@/application/entities/session';
import { SessionsRepository } from '@/application/repositories/session-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface RequestSessionProps {
  legislature: string;
  legislativeSession: string;
  type: SessionTypes;
  numberSession: number;
  openingDateTime: Date;
  closingDateTime: Date;
  cityCouncilId: string;
}

interface ResponseSessionProps {
  session: Session;
}

@Injectable()
export class CreateSession {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(data: RequestSessionProps): Promise<ResponseSessionProps> {
    const { numberSession } = data;

    const sessionFound = await this.sessionsRepository.findBySessionNumber(
      numberSession,
    );

    if (sessionFound) {
      throw new BadRequestException('Já existe uma sessão com esse número', {
        cause: new Error('Já existe uma sessão com esse número'),
        description: 'Já existe uma sessão com esse número',
      });
    }

    const session = Session.create({
      ...data,
    });

    await this.sessionsRepository.create(session);

    return { session };
  }
}
