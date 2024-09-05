import { Prisma } from '@prisma/client';
import { LegislativeMatter } from 'src/application/entities/legislative-matter';

export class PrismaLegislativeMattersMapper {
  static toDomain(legislativeMatter: any) {
    return LegislativeMatter.create(
      {
        type: legislativeMatter.type,
        summary: legislativeMatter.summary,
        presentationDate: legislativeMatter.presentationDate,
        code: legislativeMatter.code,
        title: legislativeMatter.title,
        votingType: legislativeMatter.votingType,
        status: legislativeMatter.status,
        sessionId: legislativeMatter.sessionId,
        authorId: legislativeMatter.authorId,
        officeId: legislativeMatter.officeId,
        orderDayId: legislativeMatter.orderDayId,
        createdAt: legislativeMatter.createdAt,
        updatedAt: legislativeMatter.updatedAt,
      },
      legislativeMatter.id,
    );
  }

  static toPrisma(
    legislativeMatter: LegislativeMatter,
  ): Prisma.LegislativeMatterUncheckedCreateInput {
    return {
      id: legislativeMatter.id,
      type: legislativeMatter.type,
      summary: legislativeMatter.summary,
      presentationDate: legislativeMatter.presentationDate,
      code: legislativeMatter.code,
      title: legislativeMatter.title,
      votingType: legislativeMatter.votingType,
      status: legislativeMatter.status,
      sessionId: legislativeMatter.sessionId,
      authorId: legislativeMatter.authorId,
      createdAt: legislativeMatter.createdAt,
      updatedAt: legislativeMatter.updatedAt,
      officeId: legislativeMatter.officeId,
      orderDayId: legislativeMatter.orderDayId,
    };
  }
}
