import { randomUUID } from 'node:crypto';
import { Replace } from './../../helpers/Replace';
import { User } from './user';

export type VotingType = 'SECRET' | 'NOMINAL';
export type Status =
  | 'PUBLISHED'
  | 'DISCUSSED'
  | 'VOTED_ON'
  | 'ADOPTED'
  | 'REJECTED'
  | 'POSTPONED'
  | 'WITHDRAW';

export interface LegislativeMatterProps {
  createdAt: Date;
  updatedAt?: Date;
  type: string;
  summary: string;
  presentationDate: Date;
  code: number;
  title: string;
  votingType: VotingType;
  status: Status;
  sessionId?: string;
  authorId?: string;
  officeId?: string;
  orderDayId?: string;
  author?: User;
  councilorsWhoVoted?: User[];
}

export class LegislativeMatter {
  private _id: string;
  private props: LegislativeMatterProps;

  constructor(
    props: Replace<
      LegislativeMatterProps,
      { createdAt?: Date; status?: Status }
    >,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      councilorsWhoVoted: props.councilorsWhoVoted ?? [],
      status: props.status ?? 'PUBLISHED',
    };
  }

  public get id(): string {
    return this._id;
  }

  get type() {
    return this.props.type;
  }

  set type(type: string) {
    this.props.type = type;
  }

  get summary() {
    return this.props.summary;
  }

  set summary(summary: string) {
    this.props.summary = summary;
  }

  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
  }

  get presentationDate() {
    return this.props.presentationDate;
  }

  set presentationDate(presentationDate: Date) {
    this.props.presentationDate = presentationDate;
  }

  get code() {
    return this.props.code;
  }

  set code(code: number) {
    this.props.code = code;
  }

  get votingType() {
    return this.props.votingType;
  }

  set votingType(votingType: VotingType) {
    this.props.votingType = votingType;
  }

  get status() {
    return this.props.status;
  }

  set status(status: Status) {
    this.props.status = status;
  }

  get authorId() {
    return this.props.authorId;
  }

  set authorId(authorId: string) {
    this.props.authorId = authorId;
  }

  get author() {
    return this.props.author;
  }

  set author(author: User) {
    this.props.author = author;
  }

  set officeId(officeId: string) {
    this.props.officeId = officeId;
  }

  get officeId() {
    return this.props.officeId;
  }

  set orderDayId(orderDayId: string) {
    this.props.orderDayId = orderDayId;
  }

  get orderDayId() {
    return this.props.orderDayId;
  }

  get councilorsWhoVoted() {
    return this.props.councilorsWhoVoted;
  }

  set councilorsWhoVoted(councilorsWhoVoted: User[]) {
    this.props.councilorsWhoVoted = councilorsWhoVoted;
  }

  get sessionId() {
    return this.props.sessionId;
  }

  set sessionId(sessionId: string) {
    this.props.sessionId = sessionId;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt;
  }

  static create(
    props: Replace<
      LegislativeMatterProps,
      { createdAt?: Date; status?: Status }
    >,
    id?: string,
  ) {
    const legislativeMatter = new LegislativeMatter(props, id);

    return legislativeMatter;
  }
}
