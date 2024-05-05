import { Injectable } from '@nestjs/common';
import { Notification } from 'src/application/entities/notification';
import { NotificationRepository } from 'src/application/repositories/notification-repository';
import { PrismaNotificationsMapper } from '../mappers/notifications.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaNotificationsRepository implements NotificationRepository {
  constructor(private prismaService: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Notification> {
    const notification = await this.prismaService.notification.findUnique({
      where: {
        id,
      },
    });

    if (!notification) {
      return null;
    }

    return PrismaNotificationsMapper.toDomain(notification);
  }

  async fetchAll(userId: string): Promise<Notification[]> {
    const notifications = await this.prismaService.notification.findMany({
      where: {
        userId,
      },
    });

    if (!notifications) {
      return null;
    }

    return notifications.map(PrismaNotificationsMapper.toDomain);
  }

  async fetchAllUnread(userId: string): Promise<Notification[]> {
    const notifications = await this.prismaService.notification.findMany({
      where: {
        userId,
        read: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!notifications) {
      return null;
    }

    return notifications.map(PrismaNotificationsMapper.toDomain);
  }

  async read(id: string): Promise<void> {
    await this.prismaService.notification.update({
      where: {
        id,
      },
      data: {
        read: true,
      },
    });

    return;
  }
}
