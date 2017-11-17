import { SessionStore } from './session.store';
import { SignUpValidationStore } from './sign-up-validation.store';
import { SignInValidationStore } from './sign-in-validation.store';
import { ResetPasswordValidationStore } from './reset-password-validation.store';
import { UpdatePasswordValidationStore } from './update-password-validation.store';
import { PlayerStore } from './player.store';
import { InputSearchStore } from './input-search.store';
import { EntriesSearchStore } from './entries-search.store';
import { UsersSearchStore } from './users-search.store';
import { ProfileStore } from './profile.store';

export const sessionStore = new SessionStore();
export const signUpValidationStore = new SignUpValidationStore();
export const signInValidationStore = new SignInValidationStore();
export const resetPasswordValidationStore = new ResetPasswordValidationStore();
export const updatePasswordValidationStore = new UpdatePasswordValidationStore();
export const playerStore = new PlayerStore();
export const inputSearchStore = new InputSearchStore();
export const entriesSearchStore = new EntriesSearchStore(inputSearchStore.query);
export const usersSearchStore = new UsersSearchStore(inputSearchStore.query);
export const profileStore = new ProfileStore();

