import { IntrospectionFragmentMatcher } from 'apollo-client';

/**
 * Fragment matcher makes querying union types possible
 */
const fm = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: "UNION",
          name: "SignInFacebook",
          possibleTypes: [
            {
              name: "User"
            },
            {
              name: "UsernameAndEmail"
            }
          ]
        },
      ],
    },
  }
});

export default fm;