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
  sessionId: string;
}

@Injectable()
export class UpdateSession {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(data: RequestSessionProps): Promise<void> {
    const {
      sessionId,
      legislativeSession,
      legislature,
      openingDateTime,
      closingDateTime,
      numberSession,
      type,
    } = data;

    const sessionFound = await this.sessionsRepository.findById(sessionId);

    if (!sessionFound) {
      throw new BadRequestException('Sessão não encontrada', {
        cause: new Error('Sessão não encontrada'),
        description: 'Sessão não encontrada',
      });
    }

    if (numberSession) {
      const numberSessionAlreadyExist =
        await this.sessionsRepository.findBySessionNumber(numberSession);

      if (numberSessionAlreadyExist) {
        throw new BadRequestException('Já existe uma sessão com esse número', {
          cause: new Error('Já existe uma sessão com esse número'),
          description: 'Já existe uma sessão com esse número',
        });
      }
    }

    const updates: Partial<Session> = {};

    if (legislativeSession) {
      updates.legislativeSession = legislativeSession;
    }

    if (legislature) {
      updates.legislature = legislature;
    }

    if (numberSession) {
      updates.numberSession = numberSession;
    }

    if (openingDateTime) {
      updates.openingDateTime = openingDateTime;
    }

    if (closingDateTime) {
      updates.closingDateTime = closingDateTime;
    }

    if (type) {
      updates.type = type;
    }

    updates.updatedAt = new Date();

    Object.assign(sessionFound, updates);

    await this.sessionsRepository.update(sessionFound);

    return;
  }
}
