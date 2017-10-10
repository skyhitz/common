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
    return entriesSearchBackend.search(q)
      .then(results => {
        let entries: Entry[] = results.map((result: any) => new Entry(result));
        this.setEntries(List(entries));
      });
  }

  public setEntries(entries: List<Entry>) {
    this.entries = entries;
  }

}



