import SplashScreen from './src/pages/Splash';
import Home from './src/pages/Home';
import Journal from './src/pages/Journal';
import MyCanvas from './src/pages/Canvas';
import SignIn from './src/pages/SignIn';
import Profile from './src/pages/Profile';
import { client } from './src/api/apollo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { JournalProvider } from './src/hooks/useJournal';
import { ApolloProvider } from '@apollo/client/react';
import 'expo-dev-client';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Splash: undefined;
  SignIn: undefined;
  Profile: undefined;
  Home: undefined;
  Journal: { id: string } | undefined;
  Canvas: { id: string } | undefined;
};

const Root = () => {
	return (
		<Stack.Navigator
			screenOptions={{ headerShown: false, animation: 'fade' }}
			initialRouteName="Splash"
		>
			<Stack.Screen name="Splash" component={SplashScreen} />
			<Stack.Screen name="Home" component={Home} />
			<Stack.Screen name="Journal" component={Journal} />
			<Stack.Screen name="Canvas" component={MyCanvas} />
			<Stack.Screen name="SignIn" component={SignIn} />
			<Stack.Screen name="Profile" component={Profile} />
		</Stack.Navigator>
	);
}
const App = () => {
	return (
		<>
			<StatusBar style="auto" />
			<SafeAreaProvider>
				<ApolloProvider client={client}>
					<JournalProvider>
						<NavigationContainer>
							<Root />
						</NavigationContainer>
					</JournalProvider>
				</ApolloProvider>
			</SafeAreaProvider>
		</>
	);
};

export default App;
