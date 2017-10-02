import ApolloClient, { createNetworkInterface } from 'apollo-client';
const globalAny: any = global;

globalAny.fetch = require('fetch-everywhere');

export const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'https://us-central1-skyhitz-161021.cloudfunctions.net/api/graphql'
  }),
});
