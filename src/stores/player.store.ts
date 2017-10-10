
import { observable, computed } from 'mobx';
import { Entry } from '../models';
import { List } from 'immutable';
import { streamUrlsStore } from './stream-urls.store';

export class PlayerStore {
  constructor() { }
  @observable entry: Entry;
  @observable showPlayer: boolean = false;
  @observable currentStreamUrl: string = null;
  @observable loadingStream: boolean = false;
  @observable tabBarBottomPosition: number = 0;
  @observable isPlaying: boolean = false;
  @observable loop: boolean = false;
  @observable shuffle: boolean = false;

  togglePlay() {
    this.isPlaying = !this.isPlaying;
  }

  toggleLoop() {
    this.loop = !this.loop;
  }

  toggleShuffle() {
    this.shuffle = !this.shuffle;
  }

  hidePlayer() {
    this.showPlayer = false;
  }

  play(entry: Entry): any {
    if (!entry) {
      return null;
    }

    this.entry = entry;
    this.showPlayer = true;
    this.loadingStream = true;
    return streamUrlsStore
      .getVideoStreamUrl(entry.id)
      .then(streamUrl => {
        this.currentStreamUrl = streamUrl;
        this.loadingStream = false;
      })
      .catch(e => {
        this.loadingStream = false;
        console.error('cloud not load stream url', e);
      });
  }

  playPrev() { }

  playNext() { }

  playRandom() { }

  seekToSeconds() { }

  updateTabBarBottomPosition(bottom: number) {
    this.tabBarBottomPosition = bottom;
  }

  @computed get hideTabPlayer() {
    if (!this.entry) {
      return true;
    }
    return false;
  }

}


