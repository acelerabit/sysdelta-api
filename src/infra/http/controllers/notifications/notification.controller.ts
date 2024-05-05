import { Controller, Get, Param } from '@nestjs/common';
import { Role } from '@prisma/client';
import { FetchAllUnreadNotifications } from 'src/application/use-cases/notifications/fetch-all-unread-notifications';
import { ReadNotification } from 'src/application/use-cases/notifications/read-notification';
import { Auth } from 'src/infra/decorators/auth.decorator';
import { NotificationPresenter } from './presenters/notification.presenter';

@Controller('notifications')
export class NotificationController {
  constructor(
    private fetchAllUnreadNotifications: FetchAllUnreadNotifications,
    private readNotification: ReadNotification,
  ) {}

  @Auth(Role.ADMIN, Role.USER)
  @Get('/:userId')
  async fetchUnreads(@Param('userId') userId: string) {
    const { notifications } = await this.fetchAllUnreadNotifications.execute({
      userId,
    });

    return { notifications: notifications.map(NotificationPresenter.toHTTP) };
  }

  @Auth(Role.ADMIN, Role.USER)
  @Get('/read/:id')
  async readMessage(@Param('id') id: string) {
    await this.readNotification.execute({
      id,
    });

    return;
  }
}
