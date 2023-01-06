import React, { useEffect } from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
	useEffect(() => {
		const checkUser = async () => {
			if (await isAuthenticated()) {
				navigation.replace('Home');
			} else {
				navigation.replace('SignIn');
			}
		};

		checkUser();
	}, []);

	const isAuthenticated = async () => {
		const token = await AsyncStorage.getItem('token');
		return !!token;
	};

	return (
		<View style={styles.container}>
			<Image
				style={styles.image}
				source={require('../../assets/logo-color.png')}
			/>
			<ActivityIndicator />
		</View>
	);
};

export default SplashScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: '70%',
		resizeMode: 'contain',
	},
});
