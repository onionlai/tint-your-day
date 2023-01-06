import {
	Alert,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { useEffect, useState } from 'react';

import { useMutation, gql, ApolloError } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SIGN_UP_MUTATION = gql`
	mutation signUp($email: String!, $name: String!, $password: String!) {
		signUp(input: { email: $email, password: $password, name: $name }) {
			token
			user {
				id
				name
				email
			}
		}
	}
`;

type Props = {
	onPressSwitchSignIn: () => void;
	login: () => void;
};

const SignUpScreen = ({ onPressSwitchSignIn, login }: Props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');

	const [signUp, { data, error, loading }] = useMutation(SIGN_UP_MUTATION, {
		onError: (e) => console.log(e),
	});

	const onSubmit = () => {
		const re = /\S+@\S+\.\S+/;
		const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

		if (
			email == '' ||
			password == '' ||
			!(re.test(email) || regex.test(email))
		) {
			Alert.alert('Input Wrong Format', '', [
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'OK' },
			]);
			return;
		}
		// console.log(email, password);
		signUp({ variables: { email, password, name } });
	};

	useEffect(() => {
		if (!error) return;
		if (error.graphQLErrors) Alert.alert('Invalid credentials. Try again');
		else if (error.networkError) Alert.alert('Check your Internet');
		else Alert.alert('Error. Try again');
	}, [error]);

	useEffect(() => {
		if (data) {
			// console.log(data);
			AsyncStorage.setItem('token', data.signUp.token).then(() => {
				login(); // navigate to Home Screen
			});
		}
	}, [data]);

	return (
		<>
			<TextInput
				style={styles.input}
				placeholder="Name"
				placeholderTextColor="grey"
				value={name}
				onChangeText={setName}
			/>

			<TextInput
				style={styles.input}
				placeholder="Email"
				placeholderTextColor="grey"
				value={email}
				onChangeText={setEmail}
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				secureTextEntry
				placeholderTextColor="grey"
				value={password}
				onChangeText={setPassword}
			/>

			<TouchableOpacity
				style={styles.button}
				onPress={onSubmit}
				disabled={loading}
			>
				<Text>Sign Up</Text>
			</TouchableOpacity>

			<View>
				<Text>
					Already have account?{' '}
					<Text onPress={onPressSwitchSignIn} style={styles.pressibleText}>
						Sign In
					</Text>
				</Text>
			</View>
		</>
	);
};

export default SignUpScreen;

const styles = StyleSheet.create({
	input: {
		height: 32,
		width: '100%',
		margin: 7,
		borderRadius: 3,
		fontSize: 14,
		backgroundColor: '#ebebeb',
		padding: 5,
	},
	button: {
		borderRadius: 3,
		borderWidth: 1,
		padding: 10,
		margin: 10,
	},
	pressibleText: {
		color: '#3da9c4',
	},
});
