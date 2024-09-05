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
import { ActivateUser } from '@/application/use-cases/user/activate-user';
import { InactivateUser } from '@/application/use-cases/user/inactivate-user';
import { CreateOffice } from '@/application/use-cases/office/create-office';
import { UpdateOffice } from '@/application/use-cases/office/update-office';
import { GetOffice } from '@/application/use-cases/office/get-office';
import { FetchOffice } from '@/application/use-cases/office/fetch-office';
import { DeleteOffice } from '@/application/use-cases/office/delete-office';
import { CreateOrderDay } from '@/application/use-cases/order-of-the-day/create-order-day';
import { UpdateOrderDay } from '@/application/use-cases/order-of-the-day/update-order-day';
import { FetchOrderDay } from '@/application/use-cases/order-of-the-day/fetch-order-day';
import { GetOrderDay } from '@/application/use-cases/order-of-the-day/get-order-day';
import { DeleteOrderDay } from '@/application/use-cases/order-of-the-day/delete-order-day';
import { CreateSession } from '@/application/use-cases/session/create-session';
import { UpdateSession } from '@/application/use-cases/session/update-session';
import { FetchSession } from '@/application/use-cases/session/fetch-sessions';
import { GetSession } from '@/application/use-cases/session/get-session';
import { DeleteSession } from '@/application/use-cases/session/delete-session';
import { CreateLegislativeMatter } from '@/application/use-cases/legislative-matter/create-legislative-matter';
import { UpdateLegislativeMatter } from '@/application/use-cases/legislative-matter/update-legislative-matter';
import { FetchLegislativeMatter } from '@/application/use-cases/legislative-matter/fetch-legislative-matter';
import { FetchLegislativeMatterFromSession } from '@/application/use-cases/legislative-matter/fetch-legislative-matter-from-session';
import { DeleteLegislativeMatter } from '@/application/use-cases/legislative-matter/delete-legislative-matter';
import { OfficeController } from './controllers/office/office.controller';
import { OrderDayController } from './controllers/order-day/order-day.controller';
import { SessionController } from './controllers/session/session.controller';
import { LegislativeMatterController } from './controllers/legislative-matter/legislative-matter.controller';
import { GetLegislativeMatter } from '@/application/use-cases/legislative-matter/get-legislative-matter';
import { GetOfficeBySession } from '@/application/use-cases/office/get-office-by-session';
import { GetOrderDayBySession } from '@/application/use-cases/order-of-the-day/get-order-day-by-session';

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
    OfficeController,
    OrderDayController,
    SessionController,
    LegislativeMatterController,
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
    ActivateUser,
    InactivateUser,
    CreateOffice,
    UpdateOffice,
    GetOffice,
    FetchOffice,
    DeleteOffice,
    GetOfficeBySession,
    CreateOrderDay,
    UpdateOrderDay,
    FetchOrderDay,
    GetOrderDayBySession,
    GetOrderDay,
    DeleteOrderDay,
    CreateSession,
    UpdateSession,
    FetchSession,
    GetSession,
    DeleteSession,
    CreateLegislativeMatter,
    UpdateLegislativeMatter,
    FetchLegislativeMatter,
    FetchLegislativeMatterFromSession,
    UpdateLegislativeMatter,
    DeleteLegislativeMatter,
    GetLegislativeMatter,
  ],
  imports: [DatabaseModule, EmailModule, CryptographyModule, SchedulesModule],
})
export class HttpModule {}
