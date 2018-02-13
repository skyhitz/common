import { observable, observe, IObservableObject} from 'mobx';
import { Query } from '../types/index';
import { Set, List } from 'immutable';
import { likesBackend } from '../backends/likes.backend';
import { Entry, User } from '../models';

export class LikesStore {
  @observable ids: Set<string> = Set([]);
  @observable loading: boolean = false;
  @observable loadingEntryLikes: boolean = false;
  @observable entry: Entry;
  @observable entryLikes: List<User> = List([]);
  @observable entryLikesCount: number;
  @observable userLikes: List<Entry> = List([]);
  @observable userLikesCount: number;
  public viewLimit: number = 8;

  get hasMoreLikers(): boolean {
    if (this.entryLikesCount > this.viewLimit) {
      return true;
    }
    return false;
  }

  get plusLikers() {
    return this.kFormatter(this.entryLikesCount - this.viewLimit);
  }

  kFormatter(num: number) {
    return num > 999 ? (num/1000).toFixed(1) + 'k' : num
  }

  constructor (
    public observables: IObservableObject
  ) {
  }

  public disposer = observe(this.observables, ({ object }) => {
    if (!object.entry) {
      return;
    }
    this.entry = object.entry;
    this.refreshEntryLikes(this.entry.id);
  });

  public refreshEntryLikes(id: string) {
    this.loadingEntryLikes = true;
    likesBackend.entryLikes(id)
      .then(payload => {
        this.entryLikesCount = payload.count;
        let users = payload.users.map((userPayload: any) => new User(userPayload));
        this.entryLikes = List(users);
        this.loadingEntryLikes = false;
      });
  }

  public refreshLikes() {
    this.loading = true;
    likesBackend.userLikes()
      .then(userLikes => {
        let ids = userLikes.map((like: any) => like.id);
        let entries = userLikes.map((like: any) => new Entry(like));
        this.ids = Set(ids);
        this.userLikes = List(entries);
        this.userLikesCount = this.userLikes.size;
        this.loading = false;
      });
  }

  async unlike(id: string) {
    this.ids = this.ids.delete(id);
    let unliked = await likesBackend.like(id, false);
    if (!unliked) {
      this.ids = this.ids.add(id);
    }
  }

  async like(id: string) {
    this.ids = this.ids.add(id);
    let liked = await likesBackend.like(id);
    if (!liked) {
      this.ids = this.ids.remove(id);
    }
  }

  public toggleLike(id: string) {
    if (this.isLiked) {
      return this.unlike(id);
    }
    this.like(id);
  }

  get isLiked() {
    if (!this.entry) {
      return false;
    }
    return this.ids.has(this.entry.id);
  }
}



