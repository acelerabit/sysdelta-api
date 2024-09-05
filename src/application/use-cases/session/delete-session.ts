import { SessionsRepository } from '@/application/repositories/session-repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface RequestSessionProps {
  sessionId: string;
}

@Injectable()
export class DeleteSession {
  constructor(private sessionsRepository: SessionsRepository) {}

  async execute(data: RequestSessionProps): Promise<void> {
    const { sessionId } = data;

    const sessionFound = await this.sessionsRepository.findById(sessionId);

    if (!sessionFound) {
      throw new BadRequestException('Sessão não encontrada', {
        cause: new Error('Sessão não encontrada'),
        description: 'Sessão não encontrada',
      });
    }

    await this.sessionsRepository.delete(sessionId);

    return;
  }
}
