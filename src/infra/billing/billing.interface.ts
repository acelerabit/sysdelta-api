import Stripe from 'stripe';

export abstract class BillingServiceInterface {
  abstract createCustomer(data: {
    name: string;
    email: string;
    metadata?: any;
  }): Promise<Stripe.Customer>;

  abstract createPrice(
    productId: string,
    data: {
      value: number;
      duration_months: number;
    },
  ): Promise<Stripe.Price>;

  abstract createProduct(data: {
    name: string;
    value: number;
    duration_months: number;
  }): Promise<Stripe.Product>;

  abstract retrievePaymentMethod(
    id: string,
  ): Promise<{ paymentMethod: Stripe.PaymentMethod }>;

  abstract retrieveCustomer(
    id: string,
  ): Promise<Stripe.Customer | Stripe.DeletedCustomer>;

  abstract retrieveProduct(id: string): Promise<Stripe.Product>;

  abstract retrievePrice(id: string): Promise<Stripe.Price>;

  abstract retrieveSubscription(id: string): Promise<Stripe.Subscription>;

  abstract retrieveSubscriptionItems(
    id: string,
  ): Promise<Stripe.ApiList<Stripe.SubscriptionItem>>;

  abstract deactivatePrice(id: string): Promise<void>;

  abstract listProducts(): Promise<Stripe.ApiList<Stripe.Product>>;

  abstract listCustomerPaymentMethods(
    customerId: string,
  ): Promise<Stripe.ApiList<Stripe.PaymentMethod>>;

  abstract attachPaymentMethod(
    id: string,
    paymentMethodId: string,
  ): Promise<void>;

  abstract updateProductPrice(
    productId: string,
    newPriceId: string,
    name: string,
  ): Promise<Stripe.Product>;

  abstract createPlan(
    name: string,
    price: number,
    interval: 'month',
  ): Promise<void>;

  abstract activatePlan(productId: string): Promise<void>;
  abstract inactivePlan(productId: string): Promise<void>;

  abstract getPlans(): Promise<any>;

  abstract editPlanPrice(
    productId: string,
    newPrice: number,
    newInterval: 'month',
  ): Promise<void>;

  abstract createPayment({
    price,
    customerId,
  }: {
    price: number;
    customerId: string;
  }): Promise<{
    clientSecret: string;
  }>;

  abstract createSubscription(
    customerId: string,
    priceId: string,
    trial_period_days: number,
  ): Promise<Stripe.Subscription>;

  abstract cancelSubscription(
    subscriptionId: string,
  ): Promise<{ subscription: Stripe.Subscription }>;

  abstract deleteProduct(productId: string): Promise<void>;

  abstract upgradeSubscription(
    subItemId: string,
    priceId: string,
    subscriptionId: string,
  ): Promise<Stripe.Subscription>;

  abstract attachPaymentToCustomer(
    customerId: string,
    paymentMethodId: string,
  ): Promise<void>;
  abstract changePaymentMethod(
    customerId: string,
    paymentMethodId: string,
  ): Promise<void>;

  abstract activateSubscription(
    customerId: string,
    paymentIntentId: string,
    subscriptionId: string,
  ): Promise<{
    paymentMethodId: string;
    subscription: Stripe.Subscription;
  }>;

  abstract updateAllSubscriptionsWithNewPrice(
    lastActivePrice: string,
    newPrice: string,
  ): Promise<void>;
}
