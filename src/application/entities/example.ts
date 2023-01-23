import { randomUUID } from 'node:crypto';

export interface ExampleProps {
  content: string;
  createdAt: Date;
}

export class Example {
  private _id: string;
  private props: ExampleProps;

  constructor(props: ExampleProps) {
    this._id = randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public set content(content: string) {
    this.props.content = content;
  }

  public get content(): string {
    return this.props.content;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }
}
