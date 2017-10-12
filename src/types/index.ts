export type QueryType = 'entries' | 'users';
export type Query = {type: QueryType, q: string};
export type PlaybackState = 'LOADING' | 'PLAYING' | 'PAUSED' | 'BUFFERING' | 'ERROR' | 'ENDED';
export type SeekState = 'SEEKING' | 'NOT_SEEKING' | 'SEEKED';
export type ControlsState = 'SHOWN' | 'SHOWING' | 'HIDDEN' | 'HIDDING';