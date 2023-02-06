import { AuthenticateUser } from './../../infra/http/dtos/authenticate-user';

export abstract class AuthenticateRepository {
  abstract login({ email, password }: AuthenticateUser): Promise<void>;
}
