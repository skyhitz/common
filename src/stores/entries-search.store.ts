import { Entry } from '../models/entry.model';
import { entriesBackend } from '../backends/entries.backend';
import { observable, observe } from 'mobx';
import { List } from 'immutable';
const debounce = require('lodash.debounce');

export class EntriesSearchStore {
  @observable searching: boolean = false;
  @observable query: string = '';
  @observable public entries: List<Entry> = List([]);
  constructor (
    public queryObservable: any
  ) {
  }

  public disposer = observe(this.queryObservable, ({ object }) => {
    if (object.type === 'entries' && object.q !== this.query) {
      this.query = object.q;
      this.searching = true;
      this.debouncedSearch(object.q);
    }
  });

  public searchEntries(q: string) {
    return entriesBackend.search(q)
      .then(results => {
        let entries: Entry[] = results.map((result: any) => new Entry(result));
        this.setEntries(List(entries));
        this.searching = false;
      });
  }

  public debouncedSearch = debounce(this.searchEntries, 400)

  public setEntries(entries: List<Entry>) {
    this.entries = entries;
  }

}



