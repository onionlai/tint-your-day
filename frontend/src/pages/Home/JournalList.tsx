import { useNavigation } from '@react-navigation/native';
import React, { LegacyRef, useState } from 'react';
import { FlatList } from 'react-native';
import AddBlock from './AddBlock';
import { windowWidth } from '../../data/constants';
import Block from './Block';
import { parseISO } from 'date-fns';
import { IJournal } from '../../hooks/useJournal';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';

type Props = {
	flatListRef: LegacyRef<FlatList<any>>;
	journals: IJournal[];
	viewabilityConfigCallbackPairs: any;
	handleJournalDeletion: ({ id }: { id: string }) => void;
};

const JournalList = React.memo(
	({
		flatListRef,
		journals,
		viewabilityConfigCallbackPairs,
		handleJournalDeletion,
	}: Props) => {
		// console.log('rerender flatlist :(');
		const [enabledDeletion, setEnabledDeletion] = useState(true);
		const navigation =
			useNavigation<NativeStackNavigationProp<RootStackParamList>>(); // use this hook when it's hard to pass down navigation as prop

		const openJournalScreen = ({ id }) => {
			setEnabledDeletion(false);
			navigation.navigate('Journal', { id });
		};

		const openNewCanvasScreen = () => {
			setEnabledDeletion(false);
			navigation.navigate('Canvas', { id: '-1' });
		};

		return (
			<FlatList
				style={{ flex: 1 }}
				ref={flatListRef}
				data={journals}
				ListHeaderComponent={() => <AddBlock onPress={openNewCanvasScreen} />}
				contentOffset={{ x: -windowWidth / 4, y: 0 }} // starting scroll offset
				contentContainerStyle={{
					paddingHorizontal: windowWidth / 4, // Horizontal spacing before and after the ScrollView
					// height: '95%', //@todo sometimes flatlist will have strange vertical offset and can scroll up and down ?????
				}}
				renderItem={({ item }) => {
					return (
						<Block
							date={parseISO(item.date)}
							summary={item.contents.length > 0 ? item.contents[0].content : ''}
							onPress={() => openJournalScreen({ id: item.id })}
							enabledDeletion={enabledDeletion}
							setEnabledDeletion={setEnabledDeletion}
							deleteJournal={() => handleJournalDeletion({ id: item.id })}
						/>
					);
				}}
				keyExtractor={(item) => item.id}
				horizontal
				bounces={false}
				scrollEventThrottle={32}
				snapToInterval={windowWidth / 2}
				decelerationRate={0}
				removeClippedSubviews={true} // Unmount components when outside of window
				initialNumToRender={3} // initial number to render
				maxToRenderPerBatch={3} // Reduce number in each render batch
				viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs?.current}
				showsHorizontalScrollIndicator={false}

				// ===== keep some options here in case I need to fine-tune again... =====//
				// snapToAlignment="center" //only supported @ IOS
				// onScroll={Animated.event(
				// 	[{ nativeEvent: { contentOffset: { x: scrollX },},},],
				// 	{ useNativeDriver: false })}
				// snapToOffsets={Array.apply(null, Array(journals.length)).map((_, i) => (i*(windowWidth / 2)))}
				// snapToEnd={false}
				// snapToStart={false}
				// contentInset={{
				// 	// iOS ONLY
				// 	// top: -20,
				// 	// bottom: -10,
				// }}
				// updateCellsBatchingPeriod={100} // Increase time between renders
			/>
		);
	}
);

export default JournalList;
