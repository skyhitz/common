
import { Payload } from './payload.model';
import { EntryPayload, Entry } from './entry.model';

export class PlaylistPayload extends Payload {
  photoUrl: string;
  title: string;
  description: string;
  id: string;
  PlaylistEntries: EntryPayload[];
  entries?: Entry[];
}

export class Playlist extends PlaylistPayload {
  constructor(payload: PlaylistPayload) {
    super(payload);
    this.entries = this.PlaylistEntries.map(entryPayload => new Entry(entryPayload));
  }

  get entriesCount() {
    return this.entries.length;
  }
}
