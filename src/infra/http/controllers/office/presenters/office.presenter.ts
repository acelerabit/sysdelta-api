import { Office } from '@/application/entities/office';

export class OfficesPresenters {
  static toHTTP(office: Office) {
    return {
      id: office.id,
      createdAt: office.createdAt,
      updatedAt: office.updatedAt,
      summary: office.summary,
      sessionId: office.sessionId,
    };
  }
}
