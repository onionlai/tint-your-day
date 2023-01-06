import {
	Path,
	Canvas,
	Blur,
	BlurMask,
	Group,
	useCanvasRef,
	useImage,
	Image,
} from '@shopify/react-native-skia';
import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDrawing } from './hooks/useDrawing';
import Header from './Header';
import Toolbar from './Toolbar';
import { useJournal } from '../../hooks/useJournal';

import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

import { useMutation, gql } from '@apollo/client';
import ReactNativeFile from 'apollo-upload-client/public/ReactNativeFile';
import Paint from './Paint'; // Current Drawing Stroke
import {
	BASE_URL,
	PORT,
	windowHeight,
	windowWidth,
} from '../../data/constants';

const CREATE_JOURNAL = gql`
	mutation createJournal($drawingImage: Upload) {
		createJournal(drawingImage: $drawingImage) {
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
	}
`;
const UPDATE_JOURNAL_IMAGE = gql`
	mutation updateJournalImage($id: ID, $drawingImage: Upload) {
		updateJournalImage(id: $id, drawingImage: $drawingImage) {
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
	}
`;

const DrawCanvas = ({ route, navigation }) => {
	const id: string = route.params.id;
	// console.log('rerender Canvas Screen!');

	const canvasRef = useCanvasRef();
	const { journals, setJournals } = useJournal();
	const [disabledSave, setDisabledSave] = useState(false);
	const { completedPath } = useDrawing();
	const preDrawing = useImage(
		id === '-1' ? '' : `${BASE_URL}:${PORT}/drawing-images/${id}.png`
	);
	// ex: 'http://140.112.30.32:4001/drawing-images/63b3fbf1ee672cd60bd8fb4e.png

	const [createJournal, { data, error: createError, loading }] = useMutation(
		CREATE_JOURNAL,
		{ onError: (e) => console.log(e) }
	);
	const [updateJournalImage, { error: updateError }] = useMutation(
		UPDATE_JOURNAL_IMAGE,
		{ onError: (e) => console.log(e) }
	);

	useEffect(() => {
		if (createError || updateError) Alert.alert('Error. Try again');
	}, [createError, updateError]);

	useEffect(() => {
		// console.log(data);
		if (data) {
			setJournals([data.createJournal, ...journals]);
			navigation.replace('Journal', { id: data.createJournal.id });
		}
	}, [data]);

	const goBackScreen = () => {
		navigation.goBack();
	};

	const uploadDrawing = async () => {
		try {
			const img = canvasRef.current?.makeImageSnapshot();
			// const encodedImage = img.encodeToBytes();
			const base64Image = img.encodeToBase64();

			// Request device storage access permission
			const uri = FileSystem.cacheDirectory + 'temp.png';
			await FileSystem.writeAsStringAsync(uri, base64Image, {
				encoding: FileSystem.EncodingType.Base64,
			});

			console.log(uri);
			const file = new ReactNativeFile({
				uri: uri,
				name: 'tmp.png',
				type: 'image/png',
			});
			if (id !== '-1') {
				await updateJournalImage({ variables: { id, drawingImage: file } }); // should await. Otherwise when going back, the background will not update immediately(url not ready), and won't update anymore until reopen that journal screen
				navigation.goBack();
			} else {
				createJournal({ variables: { drawingImage: file } });
			}
		} catch (e) {
			console.log(JSON.stringify(e, null, 2));
		}
	};

	const saveToLibrary = async () => {
		setDisabledSave(true);
		const imageSnapshot = canvasRef.current?.makeImageSnapshot();
		const base64Image = imageSnapshot.encodeToBase64();

		const uri = FileSystem.cacheDirectory + 'temp.png';
		await FileSystem.writeAsStringAsync(uri, base64Image, {
			encoding: FileSystem.EncodingType.Base64,
		});

		const { status } = await MediaLibrary.requestPermissionsAsync();
		if (status === 'granted') {
			// Save image to media library
			await MediaLibrary.saveToLibraryAsync(uri);
			// console.log('Image successfully saved');
		}
		setDisabledSave(false);
	};

	return (
		<View style={styles.container}>
			<View style={styles.paper}>
				<Header
					onPressDone={uploadDrawing}
					onPressBack={goBackScreen}
					onPressSave={saveToLibrary}
					disabledUpload={loading}
					disabledSave={disabledSave}
				/>
				<Canvas style={styles.canvas} ref={canvasRef}>
					{preDrawing && (
						<Image
							image={preDrawing}
							fit="fitWidth"
							width={windowWidth}
							height={windowHeight}
						/>
					)}
					<Group
						layer={
							<>
								<BlurMask blur={8} style="inner" />
								<Blur blur={2} />
							</>
						}
					>
						{completedPath.map((p, idx) => {
							return (
								<Path
									key={idx}
									path={p.path.join(' ')}
									strokeWidth={p.width}
									color={p.color}
									strokeCap="round"
									strokeJoin="round"
									style="stroke"
								/>
							);
						})}
					</Group>
				</Canvas>
				<Paint />
			</View>
			<Toolbar />
		</View>
	);
};

export default DrawCanvas;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#f0f0f0',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		overflow: 'hidden',
	},
	paper: {
		flex: 1,
		width: '100%',
		backgroundColor: '#ffffff',
		elevation: 1,
		shadowColor: 'black',
	},
	canvas: {
		height: windowHeight,
		width: windowWidth,
		zIndex: 2,
		position: 'absolute',
	},
});
