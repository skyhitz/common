
import { observable, computed } from 'mobx';
import { Entry } from '../models';
import { List } from 'immutable';
import { streamUrlsStore } from './stream-urls.store';

export class PlayerStore {
  constructor() { }
  @observable entry: Entry;
  @observable entryList: List<Entry>;
  @observable currentIndex: number;
  @observable showPlayer: boolean = false;
  @observable currentStreamUrl: string = null;
  @observable loadingStream: boolean = false;
  @observable tabBarBottomPosition: number = 0;

  getPrevIndex() {
    var lastIndex = this.entryList.size - 1;
    if (this.currentIndex === 0) {
      return lastIndex;
    }
    return this.currentIndex - 1;
  }

  getNextIndex() {
    var lastIndex = this.entryList.size - 1;
    if (lastIndex === this.currentIndex) {
      return 0;
    }
    return this.currentIndex + 1;
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


