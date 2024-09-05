import { Attachment } from '../entities/attachment';

export abstract class AttachmentsRepository {
  abstract create(attachment: Attachment): Promise<void>;
  abstract count(): Promise<number>;
  abstract findById(id: string): Promise<Attachment | null>;
  abstract findBySessionId(id: string): Promise<Attachment | null>;
  abstract delete(id: string): Promise<void>;
  abstract update(attachment: Attachment): Promise<void>;
}
