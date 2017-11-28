import { User } from '../models/user.model';
import { entriesBackend } from '../backends/entries.backend';
import { observable, observe, action } from 'mobx';
import { userBackend } from '../backends/user.backend';
import { SessionStore } from './session.store';

export class EditProfileStore {
  @observable error: string;
  @observable avatarUrl: string;
  @observable displayName: string;
  @observable description: string;
  @observable username: string;
  @observable email: string;
  @observable phone: string;

  constructor (
    public sessionStore: SessionStore
  ) {
  }

  public disposer = observe(this.sessionStore.session, ({object}) => {
    let { avatarUrl, displayName, description, username, email, phone } = object.user;
    this.avatarUrl = avatarUrl;
    this.displayName = displayName;
    this.description = description;
    this.username = username;
    this.email = email;
    this.phone = phone;
  });

  @action
  updateAvatarUrl = (text: string) => {
    this.avatarUrl = text;
  }

  @action
  updateDisplayName = (text: string) => {
    this.displayName = text;
  }

  @action
  updateDescription = (text: string) => {
    this.description = text;
  }

  @action
  updateUsername = (text: string) => {
    this.username = text;
  }

  @action
  updateEmail = (text: string) => {
    this.email = text;
  }

  @action
  updatePhone = (text: string) => {
    this.phone = text;
  }

  async updateProfile() {
    let user;
    try {
      user = await userBackend.updateUser(this.avatarUrl, this.displayName, this.description, this.username, this.email, this.phone);
    } catch (e) {
      this.error = e;
      return;
    }
    if (user) {
      return await this.sessionStore.refreshUser();
    }
  }

}



