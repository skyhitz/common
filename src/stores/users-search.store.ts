import { User } from '../models/user.model';
import { usersBackend } from '../backends/users.backend';
import { observable, observe } from 'mobx';
import { List } from 'immutable';
const debounce = require('lodash.debounce');

export class UsersSearchStore {
  @observable public users: List<User> = List([]);
  @observable searching: boolean = false;
  @observable query: string = '';
  constructor (
    public queryObservable: any
  ) {
  }

  public disposer = observe(this.queryObservable, ({object}) => {
    if (object.type === 'users' && object.q !== this.query) {
      this.query = object.q;
      this.searching = true;
      this.searchUsers(object.q);
    }
  });

  public searchUsers(q: string) {
    usersBackend.search(q)
      .then(users => {
        this.setUsers(List(users));
        this.searching = false;
      });
  }

  public debouncedSearch = debounce(this.searchUsers, 400);

  public setUsers(users: List<User>) {
    this.users = users;
  }

}



