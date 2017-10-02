
import { User } from '../models/user.model';
import { usersSearchBackend } from '../backends/users-search.backend';
import { observable } from 'mobx';
import { List } from 'immutable';

class UsersSearchStore {
  constructor (
  ) {
  }

  @observable public query: string = '';
  @observable public users: List<User> = List([]);

  public getRecentUserSearches() {
    if (this.users.size) {
      return;
    }
    this.searchUsers('');
  }

  public searchUsers(q: string) {
    usersSearchBackend.search(q)
      .then(users => this.setUsers(List(users)));
  }

  public setUsers(users: List<User>) {
    this.users = users;
  }

  public updateQuery(q: string) {
    this.query = q;
    return this.searchUsers(q);
  }

}

export const usersSearchStore = new UsersSearchStore();


