import {
	View,
	Image,
	StyleSheet,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { useState } from 'react';
import SignUpScreen from './SignUp';
import SignInScreen from './SignIn';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignIn = ({ navigation }) => {
	const [signUpMode, setSignUpMode] = useState(false);

	const login = () => {
		navigation.replace('Home');
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<KeyboardAvoidingView
					style={styles.container}
					behavior={Platform.select({ android: undefined, ios: 'padding' })}
				>
					<View style={styles.imageContainer}>
						<Image
							style={styles.logo}
							source={require('../../assets/logo-color.png')}
						/>
					</View>
					{signUpMode ? (
						<SignUpScreen
							onPressSwitchSignIn={() => {
								setSignUpMode(false);
							}}
							login={login}
						/>
					) : (
						<SignInScreen
							onPressSwitchSignIn={() => {
								setSignUpMode(true);
							}}
							login={login}
						/>
					)}
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	);
};

export default SignIn;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 20,
	},
	imageContainer: {
		height: 50,
		marginBottom: 50,
	},
	logo: {
		// backgroundColor: 'red',
		height: 50,
		position: 'relative',
		alignSelf: 'center',
		resizeMode: 'contain',
	},
});
