import { User } from '../models/user.model';
import { entriesBackend } from '../backends/entries.backend';
import { observable, observe } from 'mobx';

export class EditProfileStore {
  @observable profile: User;
  constructor (
    public user: User
  ) {
    this.profile = user;
  }

  updateDisplayName(displayName: string) {
    this.profile.displayName = displayName;
  }
  updateDescription(description: string) {
    this.profile.description = description;
  }
  updateUsername(username: string) {
    this.profile.username = username;
  }
  updateEmail(email: string) {
    this.profile.email = email;
  }
  updatePhone(phone: string) {
    this.profile.phone = phone;
  }

}



