import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const InputBox = ({
	onPressClose,
	text,
	setText,
	onSubmit,
	fixedFullScreen,
}) => {
	const [isFullScreen, setIsFullScreen] = useState(false);
	useEffect(() => {
		fixedFullScreen && setIsFullScreen(true);
	}, []);
	return (
		<View style={[styles.container, isFullScreen && { height: '100%' }]}>
			<View style={styles.background} />
			<View style={styles.textBox}>
				<TextInput
					style={styles.textInput}
					multiline
					value={text}
					onChangeText={setText}
				></TextInput>
			</View>
			<View style={styles.options}>
				{!fixedFullScreen && (
					<>
						<TouchableOpacity onPress={onPressClose}>
							<MaterialCommunityIcons
								name="arrow-collapse-down"
								size={24}
								color="black"
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => setIsFullScreen((s) => !s)}>
							<MaterialCommunityIcons
								name={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
								size={24}
								color="black"
							/>
						</TouchableOpacity>
					</>
				)}
				<TouchableOpacity onPress={onSubmit}>
					<AntDesign name="check" size={24} color="black" />
				</TouchableOpacity>
			</View>
		</View>
	);
};
export default InputBox;

const styles = StyleSheet.create({
	container: {
		// backgroundColor: 'grey',
		flexDirection: 'row',
		alignItems: 'center',
		height: '50%',
	},
	background: {
		width: '100%',
		height: '100%',
		backgroundColor: 'white',
		opacity: 0.5,
		position: 'absolute',
	},
	textBox: {
		flex: 1,
	},
	textInput: {
		flex: 1,
		margin: 5,
		marginRight: 0,
		height: '100%',
		borderWidth: 1,
		borderRadius: 3,
		fontSize: 14,
		color: 'black',
		lineHeight: 20,
		padding: 8,
		textAlignVertical: 'top', //android
	},

	options: {
		alignSelf: 'flex-end',
		width: 30,
		height: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 5,
		// flex: 1
	},
});
