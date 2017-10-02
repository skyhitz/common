import { client } from './apollo-client.backend';
import gql from 'graphql-tag';
import { Entry } from '../models/entry.model';

export class EntriesSearchBackend {
  async search(q: string) {
    return client.query({
      query: gql`
      {
        entries(search: "${q}"){
          avatarUrlSmall
          avatarUrlMedium
          avatarUrlLarge
          userDisplayName
          description
          title
          id
          viewCount
        }
      }
      `,
    })
    .then((data: any) => data.data)
    .then(({ entries }: any) => entries.map((entry: any) =>  new Entry(entry)))
    .catch(e => console.error(e));
  }
}

export const entriesSearchBackend = new EntriesSearchBackend();