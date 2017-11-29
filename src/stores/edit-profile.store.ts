import { User } from '../models/user.model';
import { entriesBackend } from '../backends/entries.backend';
import { observable, observe, action } from 'mobx';
import { userBackend } from '../backends/user.backend';
import { SessionStore } from './session.store';
require('fetch-everywhere');

const preBase64String = 'data:image/jpeg;base64,';
const cloudinaryPreset = 'ed0xgbq5';
const cloudinaryApiPath = `https://api.cloudinary.com/v1_1/skyhitz/image/upload?upload_preset=${cloudinaryPreset}`;

export class EditProfileStore {
  @observable error: string;
  @observable avatarUrl: string;
  @observable displayName: string;
  @observable description: string;
  @observable username: string;
  @observable email: string;
  @observable phone: string;
  @observable profile: User;
  @observable loadingAvatar: boolean;

  constructor (
    public sessionStore: SessionStore
  ) {
  }

  public disposer = observe(this.sessionStore.session, ({object}) => {
    this.profile = object.user;
    let { avatarUrl, displayName, description, username, email, phone } = this.profile;
    this.avatarUrl = avatarUrl;
    this.displayName = displayName;
    this.description = description;
    this.username = username;
    this.email = email;
    this.phone = phone;
  });

  async uploadProfilePhoto(image: any) {
    this.loadingAvatar = true;
    let data = new FormData();
    data.append('file', `${preBase64String}${image.base64}`);
    data.append('folder', `user_${this.sessionStore.user.id}`);
    let res = await fetch(cloudinaryApiPath, { method: 'POST', body: data });
    let { secure_url } = await res.json();
    this.updateAvatarUrl(secure_url);
    this.loadingAvatar = false;
  }

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



