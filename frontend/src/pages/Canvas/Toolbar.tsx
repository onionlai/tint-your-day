import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { color, usePaint } from './hooks/usePaint';
import { Feather } from '@expo/vector-icons';
import { useDrawing } from './hooks/useDrawing';

const ColorButton = ({ color }) => {
	const { strokeColor, setStrokeColor } = usePaint();

	return (
		<TouchableOpacity
			activeOpacity={1}
			onPress={() => {
				setStrokeColor(color.color);
			}}
			style={[{ backgroundColor: color.buttonColor }, styles.color]}
		>
			{strokeColor === color.color && <View style={styles.selectDot} />}
		</TouchableOpacity>
	);
};

const Toolbar = () => {
	const { undo, redo, reset, undoDisabled, redoDisabled } = useDrawing();

	return (
		<View style={styles.container}>
			<TouchableOpacity
				activeOpacity={0.6}
				onPress={undo}
				disabled={undoDisabled}
				style={[styles.button, undoDisabled && { opacity: 0.3 }]}
			>
				<Feather name="corner-up-left" size={18} color="black" />
			</TouchableOpacity>

			<TouchableOpacity
				activeOpacity={0.6}
				onPress={redo}
				disabled={redoDisabled}
				style={[styles.button, redoDisabled && { opacity: 0.3 }]}
			>
				<Feather name="corner-up-right" size={18} color="black" />
			</TouchableOpacity>

			<View style={styles.colorbar}>
				{color.map((color, idx) => (
					<ColorButton color={color} key={idx} />
				))}
			</View>
			<TouchableOpacity
				activeOpacity={0.6}
				onPress={reset}
				style={styles.button}
			>
				<Feather name="trash-2" size={18} color="black" strokeWidth="1" />
			</TouchableOpacity>
		</View>
	);
};

export default Toolbar;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: 60,
		position: 'absolute',
		bottom: 0,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 10,
	},
	colorbar: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	color: {
		width: 35,
		height: 35,
		marginHorizontal: 6,
		borderRadius: 100,
		borderWidth: 0.7,
		borderColor: 'grey',
		justifyContent: 'center',
		alignItems: 'center',
	},
	selectDot: {
		width: 3,
		height: 3,
		borderRadius: 100,
		backgroundColor: 'grey',
	},
	button: {
		width: 30,
		height: 30,
		marginHorizontal: 4,
		borderRadius: 100,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
