import { User } from '../models/user.model';
import { entriesBackend } from '../backends/entries.backend';
import { observable, observe, computed } from 'mobx';
import { userBackend } from '../backends/user.backend';
import { SessionStore } from './session.store';

export class EditProfileStore {
  @observable profile: User;
  @observable error: string;

  constructor (
    public sessionStore: SessionStore
  ) {
  }

  public disposer = observe(this.sessionStore.session, ({object}) => {
    this.profile = object.user;
  });


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

  updateAvatarUrl(avatarUrl: string) {
    this.profile.avatarUrl = avatarUrl;
  }

  async updateProfile() {
    let user;
    try {
      user = await userBackend.updateProfile(this.profile);
    } catch (e) {
      this.error = e;
      return;
    }
    if (user) {
      return await this.sessionStore.refreshUser();
    }
  }

}



