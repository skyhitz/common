import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { observable } from 'mobx';
import LocalStorage from '../async-storage';
const globalAny: any = global;
globalAny.fetch = require('fetch-everywhere');
import { fragmentMatcher } from '../apollo/fragment-matcher';
import { graphqlUrlStaging, graphqlUrlMaster } from '../constants/constants';

let graphqlUrl;
let dev;
if (typeof __DEV__ !== undefined && __DEV__) {
  dev = true;
} else {
  dev = false;
}
if (dev) {
  graphqlUrl = graphqlUrlStaging;
} else {
  graphqlUrl = graphqlUrlMaster;
}

let networkInterface = createNetworkInterface({
  uri: graphqlUrl
});

export let forceSignOut = observable(false);

/**
 * Gets the JWT token from local storage and passes it
 * on the authorization headers for each request.
 */
networkInterface.use([{
  async applyMiddleware(req: any, next: any) {
    if (!req.options.headers) {
      req.options.headers = {};
    }
    const userData = await LocalStorage.getItem('userData');
    if (userData) {
      const { jwt } = JSON.parse(userData);
      if (jwt) {
        req.options.headers.authorization = `Bearer ${jwt}`;
      }
    }

    next();
  },
}]);

/**
 * Loggs out the user when making unauthorized requests.
 */
networkInterface.useAfter([{
  applyAfterware({ response }: any, next: any) {
    if (!response.ok) {
      response.clone().text().then((bodyText: any) => {
        console.info(`Network Error: ${response.status} (${response.statusText}) - ${bodyText}`);
        next();
      });
    } else {
      let isUnauthorized = false;
      response.clone().json().then(({ errors }: any) => {
        if (errors) {
          console.info('GraphQL Errors:', errors);
          errors.some((error: any) => {
            if (error.message === 'Unauthorized User') {
              return isUnauthorized = true;
            }
          });
        }
      }).then(() => {
        if (isUnauthorized) {
          forceSignOut.set(true);
          return;
        }
        next();
      });
    }
  },
}]);

export const client = new ApolloClient({
  fragmentMatcher,
  networkInterface: networkInterface,
});
