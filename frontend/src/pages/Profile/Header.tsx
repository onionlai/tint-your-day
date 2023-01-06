import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HeaderProps {
	onPressClose: () => void;
}

const Header = ({ onPressClose }: HeaderProps) => {
	return (
		<SafeAreaView style={styles.container}>
			<TouchableOpacity onPress={onPressClose} style={styles.button}>
				<AntDesign name="close" size={24} color="black" />
			</TouchableOpacity>
			<Image
				style={styles.logo}
				source={require('../../assets/logo-color.png')}
			/>
			<View style={styles.button}></View>
		</SafeAreaView>
	);
};

export default Header;

const styles = StyleSheet.create({
	container: {
		height: 50,
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
	button: {
		width: 50,
		height: 50,
		position: 'relative',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 5,
	},
	logo: {
		flex: 1,
		height: 40,
		margin: 5,
		resizeMode: 'contain',
	},
});
