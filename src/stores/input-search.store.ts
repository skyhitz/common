import { observable } from 'mobx';
import { Query } from '../types/index';

export class InputSearchStore {
  public query = observable({
    type: 'entries',
    q: ''
  });

  constructor (
  ) {
  }

  public updateQuery(query: Query) {
    this.query.type = query.type;
    this.query.q = query.q;
  }
}



