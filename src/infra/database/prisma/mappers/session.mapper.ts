import { Prisma } from '@prisma/client';
import { Session } from 'src/application/entities/session';

export class PrismaSessionsMapper {
  static toDomain(session: any) {
    return Session.create(
      {
        legislature: session.legislature,
        legislativeSession: session.legislativeSession,
        type: session.type,
        numberSession: session.numberSession,
        openingDateTime: session.openingDateTime,
        closingDateTime: session.closingDateTime,
        sessionStatus: session.sessionStatus,
        attachments: [],
        cityCouncilId: session.cityCouncilId,
        officeId: session.officeId,
        orderDayId: session.orderDayId,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
      session.id,
    );
  }

  static toPrisma(session: Session): Prisma.SessionUncheckedCreateInput {
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
