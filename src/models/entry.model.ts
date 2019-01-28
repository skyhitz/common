import { Payload } from './payload.model';

export class EntryPayload extends Payload {
  userDisplayName?: string;
  userUsername?: string;
  imageUrl?: string;
  userId?: number;
  commentCount?: number;
  description?: string;
  likeCount?: number;
  publishedAt?: string;
  ranking?: number;
  shareCount?: number;
  title?: string;
  id?: string;
  videoUrl?: string;
}

export class Entry extends EntryPayload {
  constructor(payload: EntryPayload) {
    super(payload);
  }

}
