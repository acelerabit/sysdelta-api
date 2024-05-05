import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CreateUser } from 'src/application/use-cases/user/create-user';
import { LoginUser } from 'src/application/use-cases/authenticate/login-user';
import { JwtService } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module';
import { FetchAllLogs } from 'src/application/use-cases/logs/fetch-all-logs';
import { LogsController } from './controllers/logs/logs.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { UsersController } from './controllers/users/users.controller';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { UpdateUser } from '@/application/use-cases/user/update-user';
import { LoggingService } from '../services/logging.service';
import { NotificationController } from './controllers/notifications/notification.controller';
import { FetchAllUnreadNotifications } from '@/application/use-cases/notifications/fetch-all-unread-notifications';
import { ReadNotification } from '@/application/use-cases/notifications/read-notification';
import { WebSocketModule } from '../websocket/websocket.module';
import { WebsocketService } from '../websocket/websocket.service';
import { RecoveryPasswordController } from './controllers/recovery-password/recovery-password.controller';
import { UpdatePassword } from '@/application/use-cases/recovery-password/update-password';
import { SendForgotEmail } from '@/application/use-cases/recovery-password/send-forgot-email';
import { SchedulesModule } from '../schedules/schedules.module';

@Module({
  controllers: [
    UsersController,
    AuthController,
    LogsController,
    NotificationController,
    RecoveryPasswordController,
  ],
  providers: [
    CreateUser,
    LoginUser,
    FetchAllLogs,
    UpdateUser,
    JwtService,
    LoggingService,
    FetchAllUnreadNotifications,
    ReadNotification,
    WebsocketService,
    UpdatePassword,
    SendForgotEmail,
  ],
  imports: [
    DatabaseModule,
    EmailModule,
    CryptographyModule,
    WebSocketModule,
    SchedulesModule,
  ],
})
export class HttpModule {}
