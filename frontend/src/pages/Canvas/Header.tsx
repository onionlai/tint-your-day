import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HeaderProps {
	onPressBack: () => void;
	onPressDone: () => void;
	onPressSave: () => void;
	disabledUpload: boolean;
	disabledSave: boolean;
}

const Header = ({
	onPressBack,
	onPressDone: onPressDone,
	onPressSave,
	disabledUpload,
	disabledSave,
}: HeaderProps) => {
	return (
		<SafeAreaView style={styles.container}>
			{/* <View style={styles.background} /> */}
			<TouchableOpacity onPress={onPressBack} style={styles.button}>
				<Feather name="arrow-left" size={24} color="black" />
			</TouchableOpacity>
			<View style={styles.buttonGroup}>
				<TouchableOpacity
					onPress={onPressSave}
					style={[styles.button, disabledUpload && { opacity: 0.2 }]}
					disabled={disabledSave}
				>
					<Feather name="save" size={24} color="black" />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={onPressDone}
					style={[styles.button, disabledUpload && { opacity: 0.2 }]}
					disabled={disabledUpload}
				>
					<Feather name="check" size={24} color="black" />
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default Header;

const styles = StyleSheet.create({
	container: {
		height: 50,
		width: '100%',
		position: 'relative',
		justifyContent: 'space-between',
		alignContent: 'center',
		flexDirection: 'row',
		zIndex: 10,
	},
	buttonGroup: {
		flexDirection: 'row',
	},
	button: {
		width: 50,
		height: 50,
		// backgroundColor: 'red',
		position: 'relative',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 5,
	},
});
