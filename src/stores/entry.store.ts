import { observable, action, computed } from 'mobx';
import {
  cloudinaryApiVideoPath,
  preBase64String,
  preBase64StringVideo,
  cloudinaryApiPath,
  cloudinaryPreset,
} from '../constants/constants';
import { SessionStore } from './session.store';
import { entriesBackend } from '../backends/entries.backend';
import UniqueIdGenerator from '../utils/unique-id-generator';
import { Config } from '../config';

export class EntryStore {
  @observable uploadingVideo: boolean = false;
  @observable loadingVideo: boolean = false;
  @observable artworkUrl: string;
  @observable videoUrl: string;
  @observable eTag: string;
  @observable loadingArtwork: boolean;
  @observable description: string;
  @observable title: string;

  constructor(private sessionStore: SessionStore) {}

  @computed
  get currentView() {
    if (this.videoUrl && this.eTag) {
      return 'info';
    }
    return 'upload';
  }

  async loadFile(blob: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        let base64 = reader.result;
        resolve(base64);
      };
    });
  }

  async uploadVideo(base64: any) {
    this.updateUploadingVideo(true);
    let id = UniqueIdGenerator.generate();
    let data = new FormData();
    data.append('file', `${preBase64StringVideo}${base64}`);
    data.append('folder', `/app/${this.sessionStore.user.id}/videos`);
    data.append('public_id', id);
    let res;
    try {
      res = await fetch(cloudinaryApiVideoPath, { method: 'POST', body: data });
      let { secure_url, etag } = await res.json();
      this.updateUploadingVideo(false);
      this.updateEtag(etag);
      this.updateVideoUrl(secure_url);
      entriesBackend.youtubeUpload(secure_url);
    } catch (e) {
      console.log('error uploading video', e);
    }
  }

  async uploadArtwork(image: any) {
    this.loadingArtwork = true;
    let data = new FormData();
    data.append('file', `${preBase64String}${image.base64}`);
    data.append('folder', `/app/${this.sessionStore.user.username}/images`);
    let res = await fetch(cloudinaryApiPath, { method: 'POST', body: data });
    let { secure_url } = await res.json();
    this.updateArtworkUrl(secure_url);
    this.loadingArtwork = false;
  }

  @action
  updateLoadingVideo = (state: boolean) => {
    this.loadingVideo = state;
  };

  @action
  updateUploadingVideo = (state: boolean) => {
    this.uploadingVideo = state;
  };

  @action
  updateArtworkUrl = (text: string) => {
    this.artworkUrl = text;
  };

  @action
  updateVideoUrl = (text: string) => {
    this.videoUrl = text;
  };

  @action
  updateEtag = (text: string) => {
    this.eTag = text;
  };

  @action
  updateDescription = (text: string) => {
    this.description = text;
  };

  @action
  updateTitle = (text: string) => {
    this.title = text;
  };

  @computed
  get canCreate() {
    return (
      this.eTag &&
      this.artworkUrl &&
      this.videoUrl &&
      this.description &&
      this.title
    );
  }

  async create() {
    await entriesBackend.createFromUpload(
      this.eTag,
      this.artworkUrl,
      this.videoUrl,
      this.description,
      this.title
    );
  }

  async remove(entryId: string, cloudinaryPublicId: string) {
    await entriesBackend.remove(entryId, cloudinaryPublicId);
  }
}
