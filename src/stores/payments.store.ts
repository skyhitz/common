import { observable } from 'mobx';
import { paymentsBackend } from '../backends/payments.backend';

export class PaymentsStore {
  @observable
  subscribed: boolean = false;
  @observable
  subscriptionLoaded: boolean = false;
  constructor() {}

  async subscribeUser(cardToken: string) {
    await paymentsBackend.subscribe(cardToken);
    this.subscribed = true;
    return true;
  }

  async refreshSubscription() {
    let subscribed = await paymentsBackend.refreshSubscription();
    this.subscribed = subscribed;
    this.subscriptionLoaded = true;
  }
}
