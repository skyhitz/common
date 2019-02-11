import { client } from './apollo-client.backend';
import gql from 'graphql-tag';

export class PaymentsBackend {
  async subscribe(cardToken: string) {
    return client
      .mutate({
        mutation: gql`
    mutation {
      subscribeUser(cardToken: "${cardToken}")
    }
    `
      })
      .then((data: any) => data.data)
      .then(({ subscribeUser }) => subscribeUser);
  }
  async refreshSubscription() {
    return client
      .query({
        query: gql`
          {
            paymentsInfo {
              subscribed
              credits
            }
          }
        `,
        fetchPolicy: 'network-only'
      })
      .then((data: any) => data.data)
      .then(({ paymentsInfo }) => paymentsInfo);
  }
}

export const paymentsBackend = new PaymentsBackend();
