import { EvilIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { windowWidth } from '../../data/constants';

interface TextBoxProps {
	date: Date;
	content: string;
	onDelete: () => void;
}
export const TextBlock = ({ date, content, onDelete }: TextBoxProps) => {
	const [showDeleteButton, setShowDeleteButton] = useState(false);

	return (
		<Pressable
			style={styles.textBlock}
			onPress={() => setShowDeleteButton((s) => !s)}
		>
			<Text style={styles.date}>{format(date, 'LLL d, yyyy · p')}</Text>
			{showDeleteButton && (
				<Pressable style={styles.button} onPress={onDelete}>
					<EvilIcons name="close-o" size={24} color="black" />
				</Pressable>
			)}
			<View>
				<Text style={styles.content}>{content}</Text>
			</View>
		</Pressable>
	);
};

export const Separator = () => {
	return <View style={styles.separator}></View>;
};

const styles = StyleSheet.create({
	textBlock: {
		// flex: 1,
		width: windowWidth,
		alignItems: 'center',
		position: 'relative',
		// backgroundColor: 'red',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	date: {
		fontSize: 14,
		color: 'grey',
		margin: 10,
	},
	content: {
		fontSize: 14,
		color: 'black',
		textAlign: 'center',
		lineHeight: 22,
		// flex: 1,
		paddingHorizontal: 10,
	},
	separator: {
		backgroundColor: 'grey',
		alignSelf: 'center',
		margin: 10,
		height: 80,
		width: 1,
	},
	button: {
		position: 'absolute',
		padding: 10,
		right: 0,
		top: 0,
	},
});
