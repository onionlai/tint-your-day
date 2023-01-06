import {
	ApolloClient,
	ApolloLink,
	InMemoryCache,
	createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js';
import { BASE_URL, PORT } from '../data/constants';

const URI = `${BASE_URL}:${PORT}/graphql`;

const httpLink = createUploadLink({
	uri: URI,
});

const authLink = setContext(async (_, { headers }) => {
	// get the authentication token from local storage if it exists
	const token = await AsyncStorage.getItem('token');
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			token: token || '',
		},
	};
});

const customLink = new ApolloLink((operation, forward) => {
	operation.setContext({
		...operation.getContext(),
		headers: {
			...operation.getContext().headers,
			'x-apollo-operation-name': operation.operationName,
		},
	});
	return forward(operation);
});

export const client = new ApolloClient({
	link: authLink.concat(customLink).concat(httpLink),
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					project: {
						merge(existing, incoming) {
							return incoming;
						},
					},
				},
			},
		},
	}),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network',
			errorPolicy: 'all', // Promise will only reject on network errors. GraphQL errors will still be accessible through the response object, but the Promise will resolve.
		},
	},
});
