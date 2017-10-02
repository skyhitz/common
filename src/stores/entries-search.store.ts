
import { Entry } from '../models/entry.model';
import { usersSearchBackend } from '../backends/users-search.backend';
import { observable } from 'mobx';
import { List } from 'immutable';

class EntriesSearchStore {
  constructor (
  ) {
  }

  @observable public query: string = '';
  @observable public entries: List<Entry> = List([]);

  public getRecentEntriesSearches() {
    if (this.entries.size) {
      return;
    }
    this.searchEntries('');
  }

  public searchEntries(q: string) {
    usersSearchBackend.search(q)
      .then(users => this.setUsers(List(users)));
  }

  public setUsers(entries: List<Entry>) {
    this.entries = entries;
  }

  public updateQuery(q: string) {
    this.query = q;
    return this.searchEntries(q);
  }

}

export const entriesSearchStore = new EntriesSearchStore();


