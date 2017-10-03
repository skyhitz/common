import { Entry } from '../models/entry.model';
import { entriesSearchBackend } from '../backends/entries-search.backend';
import { observable, observe } from 'mobx';
import { List } from 'immutable';

export class EntriesSearchStore {
  @observable public entries: List<Entry> = List([]);
  constructor (
    public queryObservable: any
  ) {
  }

  public disposer = observe(this.queryObservable, ({ object }) => {
    if (object.type === 'entries') {
      this.searchEntries(object.q);
    }
  });

  public searchEntries(q: string) {
    entriesSearchBackend.search(q)
      .then(entries => this.setEntries(List(entries)));
  }

  public setEntries(entries: List<Entry>) {
    this.entries = entries;
  }

}



