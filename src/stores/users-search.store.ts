import { User } from '../models/user.model';
import { usersSearchBackend } from '../backends/users-search.backend';
import { observable, observe } from 'mobx';
import { List } from 'immutable';

export class UsersSearchStore {
  @observable public users: List<User> = List([]);
  constructor (
    public queryObservable: any
  ) {
  }

  public disposer = observe(this.queryObservable, ({object}) => {
    if (object.type === 'users') {
      this.searchUsers(object.q);
    }
  });

  public searchUsers(q: string) {
    usersSearchBackend.search(q)
      .then(users => this.setUsers(List(users)));
  }

  public setUsers(users: List<User>) {
    this.users = users;
  }

}



