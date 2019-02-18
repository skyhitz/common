import { observable, observe, IObservableObject } from 'mobx';
import { paymentsBackend } from '../backends/payments.backend';
import { Set, List } from 'immutable';
import { Entry, User } from '../models';

export class PaymentsStore {
  @observable ids: Set<string> = Set([]);
  @observable
  subscribed: boolean = false;
  @observable
  subscriptionLoaded: boolean = false;
  @observable
  credits: number = 0;
  counter: number = 0;
  timeout: any;
  @observable userFavorites: List<Entry> = List([]);
  @observable entry: Entry;

  constructor(public observables: IObservableObject) {}

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

  async sendCredits() {
    console.log('just sent credits', this.counter);
    clearTimeout(this.timeout);
    this.timeout = null;
    this.counter = 0;
  }

  async sendCredit(entry: Entry) {
    this.counter++;
    if (!this.timeout) {
      this.timeout = setTimeout(this.sendCredits, 1000);
    }

    if (this.ids.has(entry.id)) {
      return;
    }
    this.ids = this.ids.add(entry.id);
    this.userFavorites = this.userFavorites.push(entry);
  }

  get isFavorited() {
    if (!this.entry) {
      return false;
    }
    return this.ids.has(this.entry.id);
  }

  public disposer = observe(this.observables, ({ object }) => {
    if (!object.entry) {
      return;
    }
    this.entry = object.entry;
  });

  // public refreshFavorites() {
  //   likesBackend.userFavorites()
  //     .then(userFavorites => {
  //       let ids = userFavorites.map((favorite: any) => favorite.id);
  //       let entries = userFavorites.map((favorite: any) => new Entry(favorite));
  //       this.ids = Set(ids);
  //       this.userFavorites = List(entries);
  //     });
  // }
}
