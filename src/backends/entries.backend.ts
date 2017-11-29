import { client } from "./apollo-client.backend";
import gql from "graphql-tag";
import { Entry } from "../models/entry.model";

export class EntriesBackend {
  async search(q: string) {
    if (!q) {
      return [];
    }
    return client
      .query({
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
      `
      })
      .then((data: any) => data.data)
      .then(({ entries }: any) => entries.map((entry: any) => new Entry(entry)))
      .catch(e => console.error(e));
  }

  async getById(id: string) {
    return client
      .query({
        query: gql`
      {
        entries(id: "${id}"){
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

  async create(id: string) {
    return client
      .mutate({
        mutation: gql`
      mutation {
        createEntry(id: "${id}"){
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
}

export const entriesBackend = new EntriesBackend();