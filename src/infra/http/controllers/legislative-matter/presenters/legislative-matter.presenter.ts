import { LegislativeMatter } from '@/application/entities/legislative-matter';

export class LegislativeMattersPresenters {
  static toHTTP(legislativeMatter: LegislativeMatter) {
    return {
      id: legislativeMatter.id,
      createdAt: legislativeMatter.createdAt,
      updatedAt: legislativeMatter.updatedAt,
      type: legislativeMatter.type,
      summary: legislativeMatter.summary,
      presentationDate: legislativeMatter.presentationDate,
      code: legislativeMatter.code,
      title: legislativeMatter.title,
      votingType: legislativeMatter.votingType,
      status: legislativeMatter.status,
      sessionId: legislativeMatter.sessionId,
      authorId: legislativeMatter.authorId,
      authors: legislativeMatter.authors,
      author: legislativeMatter.author,
      councilorsWhoVoted: legislativeMatter.councilorsWhoVoted,
    };
  }
}
