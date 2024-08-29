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
import { NotificationController } from './controllers/notifications/notification.controller';
import { FetchAllUnreadNotifications } from '@/application/use-cases/notifications/fetch-all-unread-notifications';
import { ReadNotification } from '@/application/use-cases/notifications/read-notification';
import { WebsocketsGateway } from '../websocket/websocket.service';
import { RecoveryPasswordController } from './controllers/recovery-password/recovery-password.controller';
import { UpdatePassword } from '@/application/use-cases/recovery-password/update-password';
import { SendForgotEmail } from '@/application/use-cases/recovery-password/send-forgot-email';
import { SchedulesModule } from '../schedules/schedules.module';
import { UploadController } from './controllers/uploads/upload-controller';
import { Upload } from '../upload/upload';
import { LoginWithGoogle } from '@/application/use-cases/authenticate/login-with-google';
import { GetUserByEmail } from '@/application/use-cases/user/get-user-by-email';
import { GetUser } from '@/application/use-cases/user/get-user';
import { DashboardController } from './controllers/dashboard/dashboard.controller';
import { UsersMetrics } from '@/application/use-cases/dashboard/users-metrics';
import { FetchUsers } from '@/application/use-cases/user/fetch-users';
import { UploadToProfile } from '@/application/use-cases/uploads/upload-to-profile';
import { ReadAllNotifications } from '@/application/use-cases/notifications/read-all-unread-notifications';
import { BcryptHasher } from '../cryptography/bcrypt-hasher';
import { CityCouncilsController } from './controllers/city-councils/city-councils.controller';
import { CreateCityCouncil } from '@/application/use-cases/city-councils/create-city-council';
import { FetchCityCouncils } from '@/application/use-cases/city-councils/fetch-city-councils';
import { UpdateCityCouncil } from '@/application/use-cases/city-councils/update-city-council';
import { GetCityCouncil } from '@/application/use-cases/city-councils/get-city-council';
import { FetchUsersByCityCouncil } from '@/application/use-cases/user/fetch-users-by-city-council';
import { FetchCityCouncilsWithoutPaginate } from '@/application/use-cases/city-councils/fetch-city-councils-without-paginate';
import { FetchUsersAdmin } from '@/application/use-cases/user/fetch-admin-users';
import { CreateUserAdmin } from '@/application/use-cases/user/create-user-admin';
import { AssignResponsibleToCityCouncil } from '@/application/use-cases/city-councils/assign-responsible-to-city-council';
import { FetchUsersByCityCouncilWithoutPaginate } from '@/application/use-cases/user/fetch-users-by-city-council-without-paginate';
import { DeleteCityCouncil } from '@/application/use-cases/city-councils/delete-city-council';
import { DeleteUser } from '@/application/use-cases/user/delete-user';

@Module({
  controllers: [
    UsersController,
    AuthController,
    LogsController,
    NotificationController,
    RecoveryPasswordController,
    UploadController,
    DashboardController,
    CityCouncilsController,
  ],
  providers: [
    CreateUser,
    CreateUserAdmin,
    LoginUser,
    LoginWithGoogle,
    FetchAllLogs,
    UpdateUser,
    JwtService,
    FetchAllUnreadNotifications,
    ReadNotification,
    WebsocketsGateway,
    UpdatePassword,
    SendForgotEmail,
    Upload,
    GetUserByEmail,
    GetUser,
    UsersMetrics,
    FetchUsers,
    UploadToProfile,
    ReadAllNotifications,
    CreateCityCouncil,
    FetchCityCouncils,
    UpdateCityCouncil,
    GetCityCouncil,
    FetchUsersByCityCouncil,
    FetchCityCouncilsWithoutPaginate,
    FetchUsersAdmin,
    AssignResponsibleToCityCouncil,
    FetchUsersByCityCouncilWithoutPaginate,
    DeleteCityCouncil,
    DeleteUser,
  ],
  imports: [DatabaseModule, EmailModule, CryptographyModule, SchedulesModule],
})
export class HttpModule {}
