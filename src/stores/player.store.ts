
import { observable, computed } from 'mobx';
import { Entry } from '../models';
import { List } from 'immutable';
import { streamUrlsStore } from './stream-urls.store';
import { PlaybackState, SeekState, ControlsState } from '../types/index';

export class PlayerStore {
  constructor() { }
  @observable entry: Entry;
  @observable showPlayer: boolean = false;
  @observable currentStreamUrl: string = null;
  @observable loadingStream: boolean = false;
  @observable tabBarBottomPosition: number = 0;
  @observable loop: boolean = false;
  @observable shuffle: boolean = false;
  @observable playbackState: PlaybackState = 'LOADING';
  @observable seekState: SeekState = 'NOT_SEEKING';
  @observable controlsState: ControlsState = 'SHOWN';
  @observable shouldPlay: boolean = false;
  @observable positionMillis: number = 0;
  @observable durationMillis: number = 0;
  @observable lastPlaybackStateUpdate: number = Date.now();
  @observable error: any;
  @observable networkState: any;
  @observable playbackInstancePosition: any;
  @observable playbackInstanceDuration: any;
  @observable shouldPlayAtEndOfSeek: boolean = false;
  @observable playbackStatus: any;
  @observable sliderWidth: number;

  togglePlayer() {
    this.showPlayer = !this.showPlayer;
  }

  togglePlay() {
    if (this.isPlaying) {
      return this.shouldPlay = false;
    }
    return this.shouldPlay = true;
  }

  @computed get isPlaying() {
    if (this.playbackState === 'PLAYING') {
      return true;
    }
    return false;
  }

  replay() {
    this.shouldPlay = true;
    this.positionMillis = 0;
    this.playbackState = 'PLAYING';
  }

  setPlaybackState(playbackState: PlaybackState) {
    if (this.playbackState !== playbackState) {
      this.playbackState = playbackState;
      this.lastPlaybackStateUpdate = Date.now();
    }
  }

  onPlaybackStatusUpdate(playbackStatus: any) {
    this.playbackStatus = playbackStatus;
    if (!playbackStatus.isLoaded) {
      if (playbackStatus.error) {
        this.setPlaybackState('ERROR');
        const errorMsg = `Encountered a fatal error during playback: ${playbackStatus.error}`;
        this.error = errorMsg;
      }
    } else {
      // Update current position, duration, and `shouldPlay`
      this.playbackInstancePosition = playbackStatus.positionMillis;
      this.playbackInstanceDuration = playbackStatus.durationMillis;
      this.shouldPlay = playbackStatus.shouldPlay;

      // Figure out what state should be next (only if we are not seeking, other the seek action handlers control the playback state,
      // not this callback)
      if (
        this.seekState === 'NOT_SEEKING' &&
        this.playbackState !== 'ENDED'
      ) {
        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
          this.setPlaybackState('ENDED');
        } else {
          // If the video is buffering but there is no Internet, you go to the ERROR state
          if (
            this.networkState === 'none' &&
            playbackStatus.isBuffering
          ) {
            this.setPlaybackState('ERROR');
            this.error = 'You are probably offline. Please make sure you are connected to the Internet to watch this video';
          } else {
            this.setPlaybackState(
              this.isPlayingOrBufferingOrPaused(playbackStatus)
            );
          }
        }
      }
    }
  }

  isPlayingOrBufferingOrPaused = (playbackStatus: any) => {
    if (playbackStatus.isPlaying) {
      return 'PLAYING';
    }

    if (playbackStatus.isBuffering) {
      return 'BUFFERING';
    }

    return 'PAUSED';
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

  getMMSSFromMillis(millis: number) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (value: number) => {
      const result = value.toString();
      if (value < 10) {
        return '0' + result;
      }
      return result;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }

  setSeekState(seekState: SeekState) {
    this.seekState = seekState;
  }

  get seekSliderPosition() {
    if (
      this.playbackInstancePosition != null &&
      this.playbackInstanceDuration != null
    ) {
      return (
        this.playbackInstancePosition /
        this.playbackInstanceDuration
      );
    }
    return 0;
  }

  onSeekSliderValueChange = () => {
    if (
      this.seekState !== 'SEEKING'
    ) {
      this.setSeekState('SEEKING');
      // A seek might have finished (SEEKED) but since we are not in NOT_SEEKING yet, the `shouldPlay` flag
      // is still false, but we really want it be the stored value from before the previous seek
      this.shouldPlayAtEndOfSeek =
        this.seekState === 'SEEKED'
          ? this.shouldPlayAtEndOfSeek
          : this.shouldPlay;
      // Pause the video
      this.shouldPlay = false;
    }
  }

  onSeekSliderSlidingComplete = async (value: number) => {
    // Seeking is done, so go to SEEKED, and set playbackState to BUFFERING
    this.setSeekState('SEEKED');
    // If the video is going to play after seek, the user expects a spinner.
    // Otherwise, the user expects the play button
    this.setPlaybackState(
      this.shouldPlayAtEndOfSeek
        ? 'BUFFERING'
        : 'PAUSED'
    );
    this.positionMillis = value * this.playbackInstanceDuration;
    this.shouldPlay = this.shouldPlayAtEndOfSeek;
    // The underlying <Video> has successfully updated playback position
    // TODO: If `shouldPlayAtEndOfSeek` is false, should we still set the playbackState to PAUSED?
    // But because we setStatusAsync(shouldPlay: false), so the playbackStatus return value will be PAUSED.
    this.setSeekState('NOT_SEEKING');
    this.setPlaybackState(
      this.isPlayingOrBufferingOrPaused(this.playbackStatus)
    );
  }

  onSeekBarTap = (evt: any) => {
    if (
      !(
        this.playbackState === 'LOADING' ||
        this.playbackState === 'ENDED' ||
        this.playbackState === 'ERROR' ||
        this.controlsState !== 'SHOWN'
      )
    ) {
      const value = evt.nativeEvent.locationX / this.sliderWidth;
      this.onSeekSliderValueChange();
      this.onSeekSliderSlidingComplete(value);
    }
  }

  // Capture the width of the seekbar slider for use in `_onSeekbarTap`
  onSliderLayout = (evt: any) => {
    this.sliderWidth = evt.nativeEvent.layout.width;
  }

  setNetworkState(state: any) {
    this.networkState = state;
  }

}


