import { client } from './apollo-client.backend';
import gql from 'graphql-tag';
import { User } from '../models/user.model';

export class UsersSearchBackend {
  async search(q: string) {
    if (!q) {
      return [];
    }
    return client.query({
      query: gql`
      {
        users(search: "${q}"){
          avatarUrl
          bannnerUrl
          displayName
          username
          followersCount
          reputation
          id
        }
      }
      `,
    })
    .then((data: any) => data.data)
    .then(({ users }: any) => users.map((user: any) =>  new User(user)))
    .catch(e => console.error(e));
  }
}

export const usersSearchBackend = new UsersSearchBackend();