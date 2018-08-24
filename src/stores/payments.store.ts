import { paymentsBackend } from '../backends/payments.backend';

export class PaymentsStore {
  constructor() {}

  async subscribeUser(cardToken: string) {
    return paymentsBackend.subscribe(cardToken);
  }
}
