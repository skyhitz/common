
import { Payload } from './payload.model';

class UserPayload extends Payload {
  avatarUrl?: string;
  bannerUrl?: string;
  displayName?: string;
  email?: string;
  followersCount?: number;
  reputation?: number;
  publishedAt?: string;
  username?: string;
  id?: string;
  userType?: number;
  youtubeSubscriberCount?: number;
}

export class User extends UserPayload {
  constructor(payload: UserPayload) {
    super(payload);
  }

  get isYoutubeChannel(): boolean {
    return this.userType === 0;
  }

}