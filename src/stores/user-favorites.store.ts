import { observable, observe, IObservableObject } from 'mobx';
import { paymentsBackend } from '../backends/payments.backend';
import { userFavoritesBackend } from '../backends/user-favorites.backend';
import { Set, List } from 'immutable';
import { Entry, User } from '../models';

export class UserFavoritesStore {
  @observable ids: Set<string> = Set([]);
  @observable
  counter: number = 0;
  timeout: any;
  @observable entry: Entry;
  @observable userFavorites: List<Entry> = List([]);
  @observable
  creditsSent: number = 0;

  constructor(public observables: IObservableObject) {}

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
    this.updateFavorite(this.entry);
  });

  addToFavorites(entry: Entry) {
    this.ids = this.ids.add(entry.id);
    this.userFavorites = this.userFavorites.push(entry);
  }

  async updateFavorite(entry: Entry) {
    let { credits } = await userFavoritesBackend.isFavorited(entry.id);
    if (credits) {
      this.creditsSent = credits;
      this.addToFavorites(entry);
    }
  }

  async sendCredits(entry: Entry) {
    console.log('just sent credits', this.counter);
    const credited = await userFavoritesBackend.creditEntry(
      entry.id,
      this.counter
    );
    if (!credited) {
      this.creditsSent = this.creditsSent - this.counter;
      return;
    }
    clearTimeout(this.timeout);
    this.timeout = null;
    this.counter = 0;
    if (this.ids.has(entry.id)) {
      return;
    }
    this.addToFavorites(entry);
  }

  async sendCredit(entry: Entry) {
    this.creditsSent = this.creditsSent + 1;
    this.counter = this.counter + 1;
    if (!this.timeout) {
      this.timeout = setTimeout(() => this.sendCredits(entry), 1000);
    }
  }
}
