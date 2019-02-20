import { client } from './apollo-client.backend';
import gql from 'graphql-tag';

export class UserFavoritesBackend {
  async isFavorited(id: string) {
    return client
      .query({
        query: gql`
         {
          isFavorited(id: "${id}"){
            credits
          }
        }
      `
      })
      .then((data: any) => data.data)
      .then(({ isFavorited }: any) => isFavorited)
      .catch(e => console.error(e));
  }
  async creditEntry(id: string, credits: number) {
    return client
      .mutate({
        mutation: gql`
         mutation {
          creditEntry(id: "${id}", credits: ${credits})
        }
      `
      })
      .then((data: any) => data.data)
      .then(({ creditEntry }: any) => creditEntry)
      .catch(e => console.error(e));
  }
}

export const userFavoritesBackend = new UserFavoritesBackend();
