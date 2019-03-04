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
  @observable
  withdrawAddress: string;
  @observable
  creditsToWithdraw: number;
  @observable
  submittingWithdraw: boolean;

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

  async withdrawToExternalWallet() {
    this.submittingWithdraw = true;
    await paymentsBackend.withdrawToExternalWallet(
      this.withdrawAddress,
      this.creditsToWithdraw
    );
    await this.refreshSubscription();
    this.withdrawAddress = null;
    this.creditsToWithdraw = null;
    this.submittingWithdraw = false;
  }
}
