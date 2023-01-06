import { EvilIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import {
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { windowWidth } from '../../data/constants';

interface BlockProps {
	date: Date;
	summary: string;
	onPress: () => void;
	enabledDeletion: boolean;
	setEnabledDeletion: (d: boolean) => void;
	deleteJournal: () => void;
}
const Block = ({
	date,
	summary,
	onPress,
	enabledDeletion,
	setEnabledDeletion,
	deleteJournal,
}: BlockProps) => {
	const [enabledLocalDeletion, setEnabledLocalDeletion] = useState(false);

	useEffect(() => {
		if (!enabledDeletion) setEnabledLocalDeletion(false);
	}, [enabledDeletion]);

	return (
		<View style={styles.container}>
			<Pressable
				style={styles.pressDetectRange}
				onPress={() => setEnabledDeletion(false)}
			>
				<TouchableOpacity
					style={styles.box}
					onPress={onPress}
					onLongPress={() => {
						setEnabledLocalDeletion(true);
						setEnabledDeletion(true);
					}}
				>
					{enabledLocalDeletion && (
						<TouchableOpacity
							style={styles.deleteButton}
							onPress={deleteJournal}
						>
							<EvilIcons name="close" size={22} color="white" />
						</TouchableOpacity>
					)}

					<Text style={styles.year}>
						{format(date, 'yyyy')} {format(date, 'LLL')}
					</Text>
					<Text style={styles.date}>{format(date, 'dd')}</Text>

					<Text style={styles.day}>{format(date, 'iii')}</Text>
				</TouchableOpacity>

				<Text numberOfLines={3} style={styles.summary}>
					{summary}
				</Text>
			</Pressable>
		</View>
	);
};
export default Block;

const styles = StyleSheet.create({
	container: {
		width: windowWidth / 2,
		flexDirection: 'column',
		flex: 1,
	},
	pressDetectRange: {
		flex: 1,
		alignItems: 'center',
		width: '100%',
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
	deleteButton: {
		backgroundColor: '#FF665A',
		position: 'absolute',
		width: 24,
		height: 24,
		padding: 2,
		borderRadius: 100,
		justifyContent: 'center',
		alignItems: 'center',
		left: 100 - 12,
		top: -12,
	},
	year: {
		fontSize: 10,
	},
	date: {
		fontSize: 50,
		fontWeight: '100',
		lineHeight: 55,
	},
	day: {
		fontSize: 10,
	},
	summary: {
		fontSize: 12,
		color: 'grey',
		position: 'absolute',
		top: '55%',
		paddingHorizontal: 50,
		textAlign: 'center',
		lineHeight: 20,
	},
});
