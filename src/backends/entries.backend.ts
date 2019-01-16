import { client } from './apollo-client.backend';
import gql from 'graphql-tag';
import { Entry } from '../models/entry.model';
import { entriesIndex } from '../algolia/algolia';

export class EntriesBackend {
  async search(q: string) {
    if (!q) {
      return [];
    }

    const { hits } = await entriesIndex.search({
      query: q,
      attributesToRetrieve: [
        'imageUrl',
        'userDisplayName',
        'description',
        'title',
        'id',
        'videoUrl'
      ],
      hitsPerPage: 50
    });
    return hits;
  }

  async getById(id: string) {
    return client
      .query({
        query: gql`
      {
        entries(id: "${id}"){
          imageUrl
          userDisplayName
          description
          title
          id
          videoUrl
        }
      }
      `
      })
      .then((data: any) => data.data)
      .then(({ entries }: any) => {
        if (!entries.length) {
          return null;
        }
        return new Entry(entries[0]);
      })
      .catch(e => {
        console.error(e);
        return null;
      });
  }

  async getByUserId(userId: string) {
    return client
      .query({
        query: gql`
      {
        entries(userId: "${userId}"){
          imageUrl
          userDisplayName
          description
          title
          id
          videoUrl
        }
      }
      `
      })
      .then((data: any) => data.data)
      .then(({ entries }: any) => {
        if (!entries.length) {
          return null;
        }
        return entries.map((entry: any) => new Entry(entry));
      })
      .catch(e => {
        console.error(e);
        return null;
      });
  }

  async addRecentEntrySearch(id: string) {
    return client
      .mutate({
        mutation: gql`
    mutation {
      addRecentEntrySearch(id: "${id}")
    }
    `
      })
      .then((data: any) => data.data)
      .then(({ addRecentEntrySearch }) => addRecentEntrySearch);
  }

  async create(id: string) {
    return client
      .mutate({
        mutation: gql`
      mutation {
        createEntry(id: "${id}"){
          imageUrl
          userDisplayName
          description
          title
          id
          videoUrl
        }
      }
      `
      })
      .then((data: any) => data.data)
      .then(({ createEntry }) => {
        return new Entry(createEntry);
      })
      .catch(e => {
        return this.getById(id);
      });
  }

  async createFromUpload(
    etag: string,
    imageUrl: string,
    videoUrl: string,
    description: string,
    title: string
  ) {
    return client
      .mutate({
        mutation: gql`
      mutation {
        createEntry(etag: "${etag}", imageUrl: "${imageUrl}", videoUrl: "${videoUrl}", description: "${description}", title: "${title}"){
          videoUrl
          imageUrl
          description
          title
          id
        }
      }
      `
      })
      .then((data: any) => data.data)
      .then(({ createEntry }) => {
        return new Entry(createEntry);
      });
  }

  async getRecentSearches(): Promise<Entry[]> {
    return client
      .query({
        query: gql`
          {
            recentEntrySearches {
              imageUrl
              userDisplayName
              description
              title
              id
              videoUrl
            }
          }
        `
      })
      .then((data: any) => data.data)
      .then(({ recentEntrySearches }: any) =>
        recentEntrySearches.map((entry: any) => new Entry(entry))
      )
      .catch(e => {
        console.info(e);
        return [];
      });
  }

  async getTopSearches(): Promise<Entry[]> {
    return client
      .query({
        query: gql`
          {
            topEntrySearches {
              imageUrl
              userDisplayName
              description
              title
              id
              videoUrl
            }
          }
        `
      })
      .then((data: any) => data.data)
      .then(({ topEntrySearches }: any) =>
        topEntrySearches.map((entry: any) => new Entry(entry))
      )
      .catch(e => {
        console.info(e);
        return [];
      });
  }
}

export const entriesBackend = new EntriesBackend();
