import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	Alert,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
	Image,
} from 'react-native';
import Background from './Background';
import { IJournal, useJournal } from '../../hooks/useJournal';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL, PORT } from '../../data/constants';
import JournalList from './JournalList';

const JOURNAL_FIELDS = gql`
	fragment JournalFields on Journal {
		id
		date
		contents {
			id
			date
			content
		}
		drawingImage
		shown
	}
`;

const GET_JOURNAL_LIST = gql`
	${JOURNAL_FIELDS}
	query getJournalList {
		getJournalList {
			...JournalFields
		}
	}
`;

const DELETE_JOURNAL = gql`
	mutation deleteJournal($id: ID) {
		deleteJournal(id: $id)
	}
`;

const Home = ({ navigation }) => {
	// console.log('rerender Home Screen!');
	const { journals, setJournals } = useJournal();
	const [drawingUri, setDrawingUri] = useState<string>('data:image/png;base64');

	const {
		data,
		error: queryError,
		loading,
		refetch,
	} = useQuery(GET_JOURNAL_LIST, { onError: (e) => console.log(e) });
	const [deleteJournal, { data: deleteSuccess, error: deleteError }] =
		useMutation(DELETE_JOURNAL, { onError: (e) => console.log(e) });

	useFocusEffect(
		// Refetch whenever this screen is focused (navigation.goBack will not rerender by default)
		useCallback(() => {
			refetch();
			setDrawingUri((img) => `${img.split('$')[0]}?${new Date().getTime()}`); // Add Timestamp to trigger refetching this url
		}, [])
	);

	useEffect(() => {
		if (data) {
			setJournals(data.getJournalList);
		}
	}, [data]);

	useEffect(() => {
		if (deleteSuccess?.deleteJournal) {
			refetch();
		}
	}, [deleteSuccess]);

	useEffect(() => {
		if (queryError || deleteError) Alert.alert('Error. Try again');
	}, [queryError, deleteError]);

	const flatListRef = useRef<FlatList<IJournal>>(null);

	const onViewableItemsChanged = ({ viewableItems }) => {
		if (viewableItems.length !== 0) {
			setDrawingUri(
				`${BASE_URL}:${PORT}/drawing-images/${
					viewableItems[0].item.id
				}.png?${new Date().getTime()}`
			);
		} else {
			setDrawingUri('data:image/png;base64');
		}
	};
	const viewabilityConfig = {
		viewAreaCoveragePercentThreshold: 100,
		waitForInteraction: true,
		minimumViewTime: 100,
	};
	const viewabilityConfigCallbackPairs = useRef([
		{ viewabilityConfig, onViewableItemsChanged },
	]);

	const handleJournalDeletion = useCallback(
		({ id }) => {
			Alert.alert(
				'Delete this journal?',
				'All contents inside this journal will be deleted',
				[
					{
						text: 'Cancel',
						style: 'cancel',
					},
					{
						text: 'OK',
						onPress: () => {
							// console.log(`delete journal: ${id}`);
							deleteJournal({ variables: { id } });
						},
					},
				]
			);
		},
		[deleteJournal]
	); // memo this so that JournalList will not rerender

	return (
		<View style={styles.container}>
			<Background imageUri={drawingUri} />

			<SafeAreaView style={styles.logoButtonContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						navigation.navigate('Profile');
					}}
				>
					<AntDesign name="user" size={24} color="black" />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.logoContainer}
					activeOpacity={0.6}
					onPress={() => flatListRef?.current?.scrollToOffset({ offset: 0 })}
				>
					<Image
						style={styles.logo}
						source={require('../../assets/logo.png')}
					></Image>
				</TouchableOpacity>
				<View style={styles.button}></View>
			</SafeAreaView>

			{/* {!loading &&  <- don't want to unmount it*/}

			<JournalList
				flatListRef={flatListRef}
				journals={journals}
				viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
				handleJournalDeletion={handleJournalDeletion}
			/>
		</View>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	flatList: {
		flex: 1,
	},
	logoButtonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
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
	logo: {
		height: 40,
		margin: 5,
		resizeMode: 'contain',
	},
	logoContainer: {
		flex: 1,
		height: 50,
		alignItems: 'center',
	},
});
