import { StreamUrlsStore } from './stream-urls.store';
import { InputSearchStore } from './input-search.store';
import { EntriesSearchStore } from './entries-search.store';
import { UsersSearchStore } from './users-search.store';

export const streamUrlsStore = new StreamUrlsStore();
export const inputSearchStore = new InputSearchStore();
export const entriesSearchStore = new EntriesSearchStore(inputSearchStore.query);
export const usersSearchStore = new UsersSearchStore(inputSearchStore.query);

