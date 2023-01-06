import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { windowWidth } from '../../data/constants';

const AddBlock = ({ onPress }) => {
	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={onPress} style={styles.box}>
				<Text style={styles.text}>+</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: windowWidth / 2,
		flexDirection: 'column',
		alignItems: 'center',
	},
	box: {
		width: 100,
		height: 100,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: 'black',
		position: 'absolute',
		top: '35%',
		borderWidth: 1,
		padding: 10,
	},
	text: {
		fontSize: 50,
		fontWeight: '100',
		lineHeight: 55,
	},
});

export default AddBlock;
