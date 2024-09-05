import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';

export interface AttachmentProps {
  createdAt: Date;
}

export class Attachment {
  private _id: string;
  private props: AttachmentProps;

  constructor(
    props: Replace<AttachmentProps, { createdAt?: Date }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(
    props: Replace<AttachmentProps, { createdAt?: Date }>,
    id?: string,
  ) {
    const attachment = new Attachment(props, id);

    return attachment;
  }
}
