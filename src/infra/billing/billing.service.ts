import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import 'dotenv/config';
import { BillingServiceInterface } from './billing.interface';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

@Injectable()
export class BillingService implements BillingServiceInterface {
  async createCustomer(data: {
    name: string;
    email: string;
    metadata?: any;
  }): Promise<any> {
    const customer = await stripe.customers.create({
      name: data.name,
      email: data.email,
      metadata: data.metadata ?? {},
    });

    return customer;
  }

  async createPrice(
    productId: string,
    data: {
      value: number;
      duration_months: number;
    },
  ) {
    const newPrice = await stripe.prices.create({
      product: productId,
      unit_amount: data.value * 100,
      currency: 'BRL',
      recurring: {
        interval: 'month',
        interval_count: data.duration_months,
      },
    });
    return newPrice;
  }

  async createProduct(data: {
    name: string;
    value: number;
    duration_months: number;
  }) {
    const product = await stripe.products.create({
      name: data.name,
      active: false,
      default_price_data: {
        currency: 'BRL',
        unit_amount: data.value * 100,
        recurring: {
          interval: 'month',
          interval_count: data.duration_months,
        },
      },
    });

    return product;
  }

  async retrievePaymentMethod(id: string) {
    const paymentMethod = await stripe.paymentMethods.retrieve(id);

    return {
      paymentMethod,
    };
  }

  async retrieveCustomer(id: string) {
    const stripeCustomer = await stripe.customers.retrieve(id);
    return stripeCustomer;
  }

  async retrieveProduct(id: string) {
    const product = await stripe.products.retrieve(id);
    return product;
  }

  async retrievePrice(id: string) {
    const price = await stripe.prices.retrieve(id);

    return price;
  }

  async retrieveSubscription(id: string) {
    const subscription = await stripe.subscriptions.retrieve(id);
    return subscription;
  }

  async retrieveSubscriptionItems(id: string) {
    const subscription = await await stripe.subscriptionItems.list({
      limit: 1,
      subscription: id,
    });

    return subscription;
  }

  async deactivatePrice(id: string) {
    await stripe.prices.update(id, {
      active: false,
    });
  }

  async listProducts() {
    const products = await stripe.products.list();
    return products;
  }

  async listCustomerPaymentMethods(customerId: string) {
    const paymentMethods = await stripe.customers.listPaymentMethods(
      customerId,
    );

    return paymentMethods;
  }

  async attachPaymentMethod(id: string, paymentMethodId: string) {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: id,
    });
  }

  async updateProductPrice(
    productId: string,
    newPriceId: string,
    name: string,
  ) {
    const product = await stripe.products.update(`${productId}`, {
      name: name,
      default_price: newPriceId,
    });

    return product;
  }

  async createPlan(name: string, price: number, interval: 'month') {
    try {
      const product = await stripe.products.create({
        name,
      });

      const newPrice = await stripe.prices.create({
        product: product.id,
        currency: 'brl',
        unit_amount: price,
        recurring: {
          interval, // 'month'
        },
      });

      await stripe.products.update(product.id, {
        default_price: newPrice.id,
        active: false,
        metadata: {
          price,
          interval,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async activatePlan(productId: string) {
    await stripe.products.update(productId, {
      active: true,
    });
  }

  async inactivePlan(productId: string) {
    await stripe.products.update(productId, {
      active: false,
    });
  }

  async getPlans() {
    const products = await stripe.products.list();

    return products.data;
  }

  async editPlanPrice(
    productId: string,
    newPrice: number,
    newInterval: 'month',
  ) {
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
    });

    const price = await stripe.prices.create({
      product: productId,
      currency: 'brl',
      unit_amount: newPrice,
      recurring: {
        interval: newInterval,
      },
    });

    await stripe.products.update(productId, {
      default_price: price.id,
      metadata: {
        price: price.id,
        interval: newInterval,
      },
    });

    const [lastActivePrice] = prices.data;

    await stripe.prices.update(lastActivePrice.id, {
      active: false,
    });

    this.updateAllSubscriptionsWithNewPrice(lastActivePrice.id, price.id);
  }

  async createPayment({
    price,
    customerId,
  }: {
    price: number;
    customerId: string;
  }) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: 'brl',
      setup_future_usage: 'off_session',
      automatic_payment_methods: {
        enabled: true,
      },
      customer: customerId,
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async createSubscription(
    customerId: string,
    priceId: string,
    trial_period_days: number,
  ) {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      trial_period_days,
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'pause',
        },
      },
    });

    return subscription;
  }

  async cancelSubscription(subscriptionId: string) {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    return { subscription };
  }

  async deleteProduct(productId: string) {
    await stripe.products.del(productId);

    return;
  }

  async upgradeSubscription(
    subItemId: string,
    priceId: string,
    subscriptionId: string,
  ) {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subItemId,
          price: priceId,
        },
      ],
      payment_settings: { save_default_payment_method: 'on_subscription' },
    });

    return subscription;
  }

  async attachPaymentToCustomer(customerId: string, paymentMethodId: string) {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  }

  async changePaymentMethod(customerId: string, paymentMethodId: string) {
    await this.attachPaymentToCustomer(customerId, paymentMethodId);

    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  }

  async activateSubscription(
    customerId: string,
    paymentIntentId: string,
    subscriptionId: string,
  ) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentIntent.payment_method.toString(),
      },
    });

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      trial_end: 'now',
    });

    return {
      paymentMethodId: paymentIntent.payment_method.toString(),
      subscription,
    };
  }

  async updateAllSubscriptionsWithNewPrice(
    lastActivePrice: string,
    newPrice: string,
  ) {
    const subscriptions = await stripe.subscriptions.list({
      price: lastActivePrice,
    });

    const subscriptionsData = subscriptions.data;

    if (subscriptionsData.length > 0) {
      Promise.all(
        subscriptionsData.map(async (sub) => {
          const items = sub.items;
          const [item] = items.data;

          const subscription = await stripe.subscriptions.update(sub.id, {
            items: [
              {
                id: item.id,
                price: newPrice,
              },
            ],
          });
        }),
      );
    }
  }
}
