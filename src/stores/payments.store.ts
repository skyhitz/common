import { observable } from 'mobx';
import { paymentsBackend } from '../backends/payments.backend';
import { Set } from 'immutable';

export class PaymentsStore {
  @observable ids: Set<string> = Set([]);
  @observable
  subscribed: boolean = false;
  @observable
  subscriptionLoaded: boolean = false;
  @observable
  credits: number = 0;
  @observable
  submittingSubscription: boolean = false;

  constructor() {}

  async subscribeUser(cardToken: string) {
    this.submittingSubscription = true;
    await paymentsBackend.subscribe(cardToken);
    this.submittingSubscription = false;
    this.subscribed = true;
    return true;
  }

  async refreshSubscription() {
    let { subscribed, credits } = await paymentsBackend.refreshSubscription();
    this.subscribed = subscribed;
    this.credits = credits;
    this.subscriptionLoaded = true;
  }

  async withdrawToExternalWallet(address: string, amount: number) {
    await paymentsBackend.withdrawToExternalWallet(address, amount);
    await this.refreshSubscription();
  }
}
