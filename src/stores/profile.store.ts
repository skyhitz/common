import { observable } from 'mobx';
import { User, Entry } from '../models';
import { List } from 'immutable';
import { entriesBackend } from '../backends/entries.backend';

export class ProfileStore {
  @observable user: User;
  @observable entries: List<Entry> = List([]);
  @observable loadingEntries: boolean = false;
  constructor (
  ) {
  }

  public getProfileInfo(user: User) {
    this.user = user;
    this.getUserEntries(user.id);
  }

  public getUserEntries(userId: string) {
    this.loadingEntries = true;
    this.entries = List([]);
    return entriesBackend.getByUserId(userId)
    .then(entries => {
      this.setEntries(List(entries));
      this.loadingEntries = false;
    });
  }

  public setEntries(entries: List<Entry>) {
    this.entries = entries;
  }

}



