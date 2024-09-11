import { Replace } from 'src/helpers/Replace';
import { randomUUID } from 'node:crypto';
import { Attachment } from './attachment';
import { Office } from './office';
import { OrderDay } from './order-of-the-day';
import { User } from './user';

export type SessionTypes = 'ORDINARY';
export type SessionStatus =
  | 'SCHEDULED'
  | 'STARTED'
  | 'SUSPENDED'
  | 'POSTPONED'
  | 'CLOSED'
  | 'CANCELED';

export interface SessionProps {
  legislature: string;
  legislativeSession: string;
  type: SessionTypes;
  numberSession: number;
  openingDateTime: Date;
  closingDateTime: Date;
  sessionStatus: SessionStatus;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt?: Date;
  absentCouncilors?: User[];
  presentCouncilors?: User[];

  cityCouncilId: string;
  officeId?: string;
  office?: Office;
  orderDayId?: string;
  orderDay?: OrderDay;
}

export class Session {
  private _id: string;
  private props: SessionProps;

  constructor(
    props: Replace<
      SessionProps,
      {
        createdAt?: Date;
        attachments?: Attachment[];
        sessionStatus?: SessionStatus;
      }
    >,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      sessionStatus: props.sessionStatus ?? 'SCHEDULED',
      attachments: props.attachments ?? [],
    };
  }

  get id() {
    return this._id;
  }

  get legislature() {
    return this.props.legislature;
  }

  set legislature(legislature: string) {
    this.props.legislature = legislature;
  }

  get legislativeSession() {
    return this.props.legislativeSession;
  }

  set legislativeSession(legislativeSession: string) {
    this.props.legislativeSession = legislativeSession;
  }

  get numberSession() {
    return this.props.numberSession;
  }

  set numberSession(numberSession: number) {
    this.props.numberSession = numberSession;
  }

  get openingDateTime() {
    return this.props.openingDateTime;
  }

  set openingDateTime(openingDateTime: Date) {
    this.props.openingDateTime = openingDateTime;
  }

  get closingDateTime() {
    return this.props.closingDateTime;
  }

  set closingDateTime(closingDateTime: Date) {
    this.props.closingDateTime = closingDateTime;
  }

  get absentCouncilors() {
    return this.props.absentCouncilors;
  }

  set absentCouncilors(absentCouncilors: User[]) {
    this.props.absentCouncilors = absentCouncilors;
  }

  get presentCouncilors() {
    return this.props.presentCouncilors;
  }

  set presentCouncilors(presentCouncilors: User[]) {
    this.props.presentCouncilors = presentCouncilors;
  }

  get sessionStatus() {
    return this.props.sessionStatus;
  }

  set sessionStatus(sessionStatus: SessionStatus) {
    this.props.sessionStatus = sessionStatus;
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: Attachment[]) {
    this.props.attachments = attachments;
  }

  get type() {
    return this.props.type;
  }

  set type(type: SessionTypes) {
    this.props.type = type;
  }

  get cityCouncilId() {
    return this.props.cityCouncilId;
  }

  set cityCouncilId(cityCouncilId: string) {
    this.props.cityCouncilId = cityCouncilId;
  }

  get orderDayId() {
    return this.props.orderDayId;
  }

  set orderDayId(orderDayId: string) {
    this.props.orderDayId = orderDayId;
  }

  get orderDay() {
    return this.props.orderDay;
  }

  set orderDay(orderDay: OrderDay) {
    this.props.orderDay = orderDay;
  }

  get officeId() {
    return this.props.officeId;
  }

  set officeId(officeId: string) {
    this.props.officeId = officeId;
  }

  get office() {
    return this.props.office;
  }

  set office(office: Office) {
    this.props.office = office;
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
      SessionProps,
      {
        createdAt?: Date;
        attachments?: Attachment[];
        sessionStatus?: SessionStatus;
      }
    >,
    id?: string,
  ) {
    const session = new Session(props, id);

    return session;
  }
}
