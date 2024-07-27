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
import { BillingService } from '../billing/billing.service';
import { SubscriptionController } from './controllers/subscription/subscription.controller';
import { PaymentController } from './controllers/payment/payment.controller';
import { PlanController } from './controllers/plan/plan.controller';
import { GetUserSubscription } from '@/application/use-cases/subscription/get-subscription-by-user-id';
import { FetchSubscriptions } from '@/application/use-cases/subscription/fetch-subscriptions';
import { CancelSubscription } from '@/application/use-cases/subscription/cancel-subscription';
import { GetUserCard } from '@/application/use-cases/card/get-user-card';
import { ChangePaymentMethod } from '@/application/use-cases/subscription/change-payment-method';
import { FetchUserCards } from '@/application/use-cases/card/fetch-user-cards';
import { CheckUserSubscription } from '@/application/use-cases/subscription/check-user-subscription';
import { UpdateUserSubscription } from '@/application/use-cases/subscription/change-user-subscription';
import { CreateSubscription } from '@/application/use-cases/subscription/create-subscription';
import { ActivateSubscription } from '@/application/use-cases/subscription/activate-subscription';
import { FetchPlansAvailableToUser } from '@/application/use-cases/plan/fetch-plans-available-to-user';
import { FetchPlansAvailableToUpgrade } from '@/application/use-cases/plan/fetch-plans-available-to-upgrade';
import { FetchPlans } from '@/application/use-cases/plan/fetch-plans';
import { DeletePlan } from '@/application/use-cases/plan/delete-plan';
import { TurnPlanDefault } from '@/application/use-cases/plan/turn-plan-default';
import { GetDefaultPlan } from '@/application/use-cases/plan/get-default-plan';
import { CreatePlan } from '@/application/use-cases/plan/create-plan';
import { DeactivatePlan } from '@/application/use-cases/plan/deactive-plan';
import { ActivePlan } from '@/application/use-cases/plan/active-plan';
import { UpdatePlan } from '@/application/use-cases/plan/update';
import { PublishPlan } from '@/application/use-cases/plan/publish-plan';
import { UnpublishPlan } from '@/application/use-cases/plan/unpublish-plan';
import { BillingWebhookService } from '../billing/billing-webhook.service';
import { FetchPayments } from '@/application/use-cases/payments/fetch-payments';
import { FetchUnpaidPayments } from '@/application/use-cases/payments/fetch-unpaid-payments';
import { CreatePaymentIntent } from '@/application/use-cases/payments/create-payment-intent';
import { BcryptHasher } from '../cryptography/bcrypt-hasher';
import { CreatePayment } from '@/application/use-cases/payments/create-payment';

@Module({
  controllers: [
    UsersController,
    AuthController,
    LogsController,
    NotificationController,
    RecoveryPasswordController,
    UploadController,
    DashboardController,
    SubscriptionController,
    PaymentController,
    PlanController,
  ],
  providers: [
    CreateUser,
    LoginUser,
    LoginWithGoogle,
    FetchAllLogs,
    UpdateUser,
    JwtService,
    LoggingService,
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
    BillingService,
    GetUserSubscription,
    FetchSubscriptions,
    CancelSubscription,
    GetUserCard,
    ChangePaymentMethod,
    FetchUserCards,
    CheckUserSubscription,
    UpdateUserSubscription,
    CreateSubscription,
    ActivateSubscription,
    FetchPlansAvailableToUser,
    FetchPlansAvailableToUpgrade,
    FetchPlans,
    DeletePlan,
    TurnPlanDefault,
    GetDefaultPlan,
    CreatePlan,
    DeactivatePlan,
    ActivePlan,
    UpdatePlan,
    PublishPlan,
    UnpublishPlan,
    BillingWebhookService,
    FetchPayments,
    FetchUnpaidPayments,
    CreatePaymentIntent,
    BcryptHasher,
    CreatePayment,
  ],
  imports: [DatabaseModule, EmailModule, CryptographyModule, SchedulesModule],
})
export class HttpModule {}
