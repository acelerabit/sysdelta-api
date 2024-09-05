import { Session } from '@/application/entities/session';

export class SessionsPresenters {
  static toHTTP(session: Session) {
    return {
      id: session.id,
      legislature: session.legislature,
      legislativeSession: session.legislativeSession,
      type: session.type,
      numberSession: session.numberSession,
      openingDateTime: session.openingDateTime,
      closingDateTime: session.closingDateTime,
      sessionStatus: session.sessionStatus,
      cityCouncilId: session.cityCouncilId,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}
