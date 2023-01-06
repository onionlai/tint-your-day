import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';

interface HeaderProps {
	onPressBack: () => void;
	onPressDraw: () => void;
}
const Header = ({ onPressBack, onPressDraw }: HeaderProps) => {
	const insets = useSafeAreaInsets();
	return (
		<View
			style={[
				styles.container,
				{ paddingTop: insets.top, height: 50 + insets.top },
			]}
		>
			<TouchableOpacity onPress={onPressBack} style={styles.button}>
				<Feather name="arrow-left" size={24} color="black" />
			</TouchableOpacity>
			<TouchableOpacity onPress={onPressDraw} style={styles.button}>
				<MaterialCommunityIcons name="draw" size={24} color="black" />
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 50,
		width: '100%',
		position: 'relative',
		justifyContent: 'space-between',
		alignContent: 'center',
		flexDirection: 'row',
		zIndex: 5,
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
	},
	button: {
		width: 50,
		height: 50,
		position: 'relative',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Header;
