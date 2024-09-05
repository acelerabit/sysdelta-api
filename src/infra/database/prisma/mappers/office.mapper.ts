import { LegislativeMatter } from '@/application/entities/legislative-matter';
import { Prisma } from '@prisma/client';
import { Office } from 'src/application/entities/office';
import { PrismaLegislativeMattersMapper } from './legislative.mapper';

export class PrismaOfficesMapper {
  static toDomain(office: any) {
    return Office.create(
      {
        summary: office.summary,
        sessionId: office.sessionId,
        createdAt: office.createdAt,
        // legislativeMatters: office.legislativeMatters.map((legislativeMatter) =>
        //   LegislativeMatter.create({
        //     code: legislativeMatter.code,
        //     presentationDate: legislativeMatter.presentationDate,
        //     status: legislativeMatter.status,
        //     summary: legislativeMatter.summary,
        //     title: legislativeMatter.title,
        //     type: legislativeMatter.type,
        //     votingType: legislativeMatter.votingType,
        //     authorId: legislativeMatter.authorId,
        //     sessionId: legislativeMatter.sessionId,
        //   }),
        // ),
        legislativeMatters: office.legislativeMatters.map(
          PrismaLegislativeMattersMapper.toDomain,
        ),
      },
      office.id,
    );
  }

  static toPrisma(office: Office): Prisma.OfficeUncheckedCreateInput {
    return {
      id: office.id,
      summary: office.summary,
      sessionId: office.sessionId,
      createdAt: office.createdAt,
    };
  }
}
