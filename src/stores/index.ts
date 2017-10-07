import { PlayerStore } from './player.store';
import { InputSearchStore } from './input-search.store';
import { EntriesSearchStore } from './entries-search.store';
import { UsersSearchStore } from './users-search.store';

export const playerStore = new PlayerStore();
export const inputSearchStore = new InputSearchStore();
export const entriesSearchStore = new EntriesSearchStore(inputSearchStore.query);
export const usersSearchStore = new UsersSearchStore(inputSearchStore.query);

