import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';
import { LegislativeMatter } from './legislative-matter';

export interface OrderDayProps {
  createdAt: Date;
  updatedAt?: Date;
  summary: string;
  legislativeMatters: LegislativeMatter[];
  sessionId: string;
}

export class OrderDay {
  private _id: string;
  private props: OrderDayProps;

  constructor(
    props: Replace<
      OrderDayProps,
      { createdAt?: Date; legislativeMatters?: LegislativeMatter[] }
    >,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      legislativeMatters: props.legislativeMatters ?? [],
    };
  }

  public get id(): string {
    return this._id;
  }

  get legislativeMatters() {
    return this.props.legislativeMatters;
  }

  set legislativeMatters(legislativeMatters: LegislativeMatter[]) {
    this.props.legislativeMatters = legislativeMatters;
  }

  get summary() {
    return this.props.summary;
  }

  set summary(summary: string) {
    this.props.summary = summary;
  }

  get sessionId() {
    return this.props.sessionId;
  }

  set sessionId(sessionId: string) {
    this.props.sessionId = sessionId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  static create(
    props: Replace<
      OrderDayProps,
      { createdAt?: Date; legislativeMatters?: LegislativeMatter[] }
    >,
    id?: string,
  ) {
    const orderDay = new OrderDay(props, id);

    return orderDay;
  }
}
