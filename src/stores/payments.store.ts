import { observable } from 'mobx';
import { paymentsBackend } from '../backends/payments.backend';

export class PaymentsStore {
  @observable
  subscribed: boolean = false;
  @observable
  subscriptionLoaded: boolean = false;
  @observable
  credits: number = 0;
  constructor() {}

  async subscribeUser(cardToken: string) {
    await paymentsBackend.subscribe(cardToken);
    this.subscribed = true;
    return true;
  }

  async refreshSubscription() {
    let { subscribed, credits } = await paymentsBackend.refreshSubscription();
    this.subscribed = subscribed;
    this.credits = credits;
    this.subscriptionLoaded = true;
  }
}
