import { client } from './apollo-client.backend';
import gql from 'graphql-tag';
import { User } from '../models/user.model';

export class UsersBackend {
  async search(q: string) {
    if (!q) {
      return [];
    }
    return client.query({
      query: gql`
      {
        users(search: "${q}"){
          avatarUrl
          bannerUrl
          displayName
          username
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

  async getRecentSearches(): Promise<User[]> {
    return client
    .query({
      query: gql`
    {
      usersRecentSearches {
        avatarUrl
        bannerUrl
        displayName
        username
        reputation
        id
      }
    }
    `
    })
    .then((data: any) => data.data)
    .then(({ usersRecentSearches }: any) => usersRecentSearches.map((user: any) => new User(user)))
    .catch(e => {
      console.info(e);
      return [];
    });
  }

  async getTopSearches(): Promise<User[]> {
    return client
    .query({
      query: gql`
    {
      usersTopSearches {
        avatarUrl
        bannerUrl
        displayName
        username
        reputation
        id
      }
    }
    `
    })
    .then((data: any) => data.data)
    .then(({ usersTopSearches }: any) => usersTopSearches.map((user: any) => new User(user)))
    .catch(e => {
      console.info(e);
      return [];
    });
  }
}

export const usersBackend = new UsersBackend();