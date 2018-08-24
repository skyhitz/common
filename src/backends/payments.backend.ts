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
}

export const paymentsBackend = new PaymentsBackend();
