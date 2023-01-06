import {
	Alert,
	FlatList,
	Image,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Separator, TextBlock } from './TextBlock';
import Header from './Header';

import {
	AntDesign,
	Ionicons,
	MaterialCommunityIcons,
} from '@expo/vector-icons';
import InputBox from './InputBox';
import { IContent, useJournal } from '../../hooks/useJournal';
import { useMutation, useQuery, gql } from '@apollo/client';
import { parseISO } from 'date-fns';
import { BASE_URL, PORT, windowHeight } from '../../data/constants';
import { useFocusEffect } from '@react-navigation/native';

const CONTENT_FIELDS = gql`
	fragment ContentFields on Content {
		id
		date
		content
	}
`;
const GET_JOURNAL_CONTENTS = gql`
	${CONTENT_FIELDS}
	query getJournalContents($id: ID) {
		getJournalContents(id: $id) {
			...ContentFields
		}
	}
`;
const ADD_JOURNAL_CONTENT = gql`
	${CONTENT_FIELDS}
	mutation addJournalContent($id: ID, $content: String) {
		addJournalContent(id: $id, content: $content) {
			...ContentFields
		}
	}
`;
const DELETE_JOURNAL_CONTENT = gql`
	${CONTENT_FIELDS}
	mutation deleteJournalContent($id: ID, $contentID: ID) {
		deleteJournalContent(id: $id, contentID: $contentID) {
			...ContentFields
		}
	}
`;

const Journal = ({ route, navigation }) => {
	const id: string = route.params.id;

	const { contents, setContents } = useJournal();
	const [inputOpen, setInputOpen] = useState<boolean>(false);
	const [inputText, setInputText] = useState<string>('');
	const [isEmptyJournal, setIsEmptyJournal] = useState(false);
	const [drawingUri, setDrawingUri] = useState(
		`${BASE_URL}:${PORT}/drawing-images/${id}.png?${new Date().getTime()}`
	);

	const {
		data: dataInit,
		error: queryError,
		loading: queryLoading,
	} = useQuery(GET_JOURNAL_CONTENTS, {
		variables: { id },
		onError: (e) => console.log(e),
	});

	const [submitContent, { data: dataAfterAdd, error: addError }] = useMutation(
		ADD_JOURNAL_CONTENT,
		{ onError: (e) => console.log(e) }
	);

	const [deleteContent, { data: dataAfterDeletion, error: deleteError }] =
		useMutation(DELETE_JOURNAL_CONTENT, { onError: (e) => console.log(e) });

	useEffect(() => {
		if (addError || deleteError || queryError) Alert.alert('Error. Try again');
	}, [addError, deleteError, queryError]);

	const flatListRef = useRef<FlatList<IContent>>(null);

	useFocusEffect(
		useCallback(() => {
			setDrawingUri(
				`${BASE_URL}:${PORT}/drawing-images/${id}.png?${new Date().getTime()}`
			); // Add timestamp so that it will refetch image url on goBack. Cool!
		}, [])
	);

	useEffect(() => {
		if (dataInit) {
			setContents(dataInit.getJournalContents);
		}
	}, [dataInit]);

	useEffect(() => {
		if (dataAfterAdd) {
			setContents(dataAfterAdd.addJournalContent);
			setInputText('');
		}
	}, [dataAfterAdd]);

	useEffect(() => {
		if (dataAfterDeletion) {
			setContents(dataAfterDeletion.deleteJournalContent);
			setInputText('');
		}
	}, [dataAfterDeletion]);

	useEffect(() => {
		// console.log(contents);
		if (contents.length === 0) {
			setIsEmptyJournal(true);
			setInputOpen(true);
		} else {
			setIsEmptyJournal(false);
			setInputOpen(false);
		}
	}, [contents]);

	const handleSubmit = () => {
		if (inputText === '') return;
		setInputOpen(false);
		submitContent({ variables: { id, content: inputText } });
		flatListRef.current?.scrollToEnd();
	};

	const handleDelete = (contentID) => {
		Alert.alert('Delete this content?', '', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'OK',
				onPress: () => {
					console.log(`delete: ${id} ${contentID}`);
					deleteContent({ variables: { id, contentID } });
				},
			},
		]);
	};

	return (
		<View style={styles.container}>
			<Header
				onPressBack={() => navigation.goBack()}
				onPressDraw={() => navigation.navigate('Canvas', { id })}
			/>

			<Image style={styles.background} source={{ uri: drawingUri }} />

			{!queryLoading && (
				<KeyboardAvoidingView
					behavior={Platform.select({ android: undefined, ios: 'padding' })}
					style={styles.container2}
				>
					<FlatList
						ref={flatListRef}
						contentContainerStyle={styles.flatList}
						style={{ overflow: inputOpen ? 'hidden' : 'visible' }}
						data={contents}
						renderItem={({ item, index }) => {
							return (
								<TextBlock
									date={parseISO(item.date)}
									content={item.content}
									onDelete={() => handleDelete(item.id)}
								/>
							);
						}}
						// bounces={false}
						ItemSeparatorComponent={Separator}
						ListFooterComponent={() => (
							<>
								<Separator />
								<TouchableOpacity onPress={() => setInputOpen(true)}>
									<Ionicons name="add-circle-outline" size={24} color="black" />
								</TouchableOpacity>
							</>
						)}
						initialNumToRender={10} // initial number to render
						maxToRenderPerBatch={10} // Reduce number in each render batch
					/>
					{inputOpen ? (
						<InputBox
							onPressClose={() => setInputOpen(false)}
							text={inputText}
							setText={setInputText}
							onSubmit={handleSubmit}
							fixedFullScreen={isEmptyJournal}
						/>
					) : (
						<TouchableOpacity
							onPress={() => setInputOpen((o) => !o)}
							style={styles.button}
						>
							{inputText === '' ? (
								<AntDesign name="plus" size={24} color="black" />
							) : (
								<MaterialCommunityIcons
									name="arrow-collapse-up"
									size={24}
									color="black"
								/>
							)}
						</TouchableOpacity>
					)}
				</KeyboardAvoidingView>
			)}
		</View>
	);
};

export default Journal;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	container2: {
		flex: 1,
	},
	flatList: {
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingBottom: 50,
	},
	background: {
		position: 'absolute',
		flex: 1,
		width: '100%',
		height: windowHeight,
		backgroundColor: 'white',
		opacity: 0.8,
	},
	button: {
		// right-bottom button
		height: 30,
		width: 30,
		alignSelf: 'flex-end',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 3,
	},
});
