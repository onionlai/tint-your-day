import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Header from './Header';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GET_USER_INFO = gql`
	query getUserInfo {
		getUserInfo {
			id
			name
			email
		}
	}
`;

const Profile = ({ navigation }) => {
	const [name, setName] = useState('');
	// const [email, setEmail] = useState('');
	const { data, error } = useQuery(GET_USER_INFO, {
		onError: (e) => console.log(e),
	});

	const onSignOut = async () => {
		await AsyncStorage.removeItem('token');
		navigation.pop(1);
		navigation.replace('Splash');
	};

	useEffect(() => {
		if (error) Alert.alert('Error. Try again');
	}, [error]);

	useEffect(() => {
		if (data) {
			setName(data.getUserInfo?.name);
			// setEmail(data.getUserInfo.email);
		}
	}, [data]);

	return (
		<View style={{ flex: 1 }}>
			<Header onPressClose={() => navigation.goBack()} />
			<View style={styles.container}>
				<Text style={styles.name}>Welcome, {name}.</Text>
				<TouchableOpacity style={styles.button} onPress={onSignOut}>
					<Text>Sign Out</Text>
				</TouchableOpacity>
				<View style={styles.infoContainer}>
					<Text style={styles.text}>Contact us</Text>
					<Text style={styles.text}>
						<Ionicons name="md-mail" size={15} color="grey" />{' '}
						b07502165@ntu.edu.tw
					</Text>
					<Text style={styles.text}>
						<Ionicons name="ios-logo-github" size={15} color="grey" />{' '}
						github.com/onionlai
					</Text>
				</View>
				<Text style={styles.copyrightText}>
					© Copyright 2023 by Chao-Jung, Lai. All Rights Reserved.
				</Text>
			</View>
		</View>
	);
};

export default Profile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 20,
		// backgroundColor: 'red'
	},
	button: {
		borderRadius: 3,
		padding: 10,
		margin: 10,
		borderWidth: 1,
	},
	name: {
		fontSize: 20,
		padding: 20,
	},
	text: {
		fontSize: 12,
		color: 'grey',
		textAlign: 'center',
		lineHeight: 20,
	},
	infoContainer: {
		position: 'absolute',
		bottom: 50,
	},
	copyrightText: {
		fontSize: 10,
		color: '#bdbdbd',
		textAlign: 'center',
		position: 'absolute',
		bottom: 8,
	},
});
