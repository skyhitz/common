import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { observable } from 'mobx';
import LocalStorage from '../async-storage';
const globalAny: any = global;
globalAny.fetch = require('fetch-everywhere');
let graphqlUrl;

if (__DEV__) {
  graphqlUrl = 'https://us-central1-skyhitz-161021.cloudfunctions.net/staging-api/graphql';
} else {
  graphqlUrl = 'https://us-central1-skyhitz-161021.cloudfunctions.net/master-api/graphql';
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
  async applyMiddleware(req: any, next) {
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
  applyAfterware({ response }, next) {
    if (!response.ok) {
      response.clone().text().then((bodyText) => {
        console.info(`Network Error: ${response.status} (${response.statusText}) - ${bodyText}`);
        next();
      });
    } else {
      let isUnauthorized = false;
      response.clone().json().then(({ errors }) => {
        if (errors) {
          console.info('GraphQL Errors:', errors);
          errors.some((error: any) => {
            if (error.message == 'Unauthorized User'){
              return isUnauthorized = true;
            }
          })
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
  networkInterface: networkInterface,
});
