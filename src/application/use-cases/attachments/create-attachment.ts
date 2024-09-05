import { Attachment } from '@/application/entities/attachment';
import { AttachmentsRepository } from '@/application/repositories/attachment-repository';

export class CreateAttachment {
  constructor(private attachmentRepository: AttachmentsRepository) {}

  async execute() {
    const attachment = Attachment.create({});

    await this.attachmentRepository.create(attachment);

    return;
  }
}
