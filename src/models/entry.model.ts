
import { Payload } from './payload.model';

export class EntryPayload extends Payload {
  userDisplayName?: string;
  avatarUrlSmall?: string;
  avatarUrlMedium?: string;
  avatarUrlLarge?: number;
  userId?: number;
  commentCount?: number;
  description?: string;
  likeCount?: number;
  points?: number;
  publishedAt?: string;
  ranking?: number;
  shareCount?: number;
  title?: string;
  id?: string;
  viewCount?: number;
}

export class Entry extends EntryPayload {
  constructor(payload: EntryPayload) {
    super(payload);
  }
}