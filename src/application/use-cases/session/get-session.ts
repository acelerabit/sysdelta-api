import { Session } from '@/application/entities/session';
import { SessionsRepository } from '@/application/repositories/session-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface RequestSessionProps {
  sessionId: string;
}

interface ResponseSessionProps {
  session: Session;
}

@Injectable()
export class GetSession {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(data: RequestSessionProps): Promise<ResponseSessionProps> {
    const { sessionId } = data;

    const sessionFound = await this.sessionsRepository.findById(sessionId);

    if (!sessionFound) {
      throw new BadRequestException('Sessão não encontrada', {
        cause: new Error('Sessão não encontrada'),
        description: 'Sessão não encontrada',
      });
    }

    return { session: sessionFound };
  }
}
