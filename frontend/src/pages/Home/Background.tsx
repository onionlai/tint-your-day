import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';
import { windowHeight } from '../../data/constants';

interface BackgroundProps {
	imageUri: string;
}

const Background = ({ imageUri }: BackgroundProps) => {
	const [prevImage, setprevImage] = useState<string>('data:image/png;base64');
	const opacityFadeOut = useRef(new Animated.Value(1)).current;
	const opacityFadeIn = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		opacityFadeOut.setValue(1); // opacity: 1-->0
		Animated.timing(opacityFadeOut, {
			toValue: 0,
			duration: 400,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start((finish) => {
			// callback function at the end
			if (finish) setprevImage(imageUri); // if another animation begin, finish=false
		});

		opacityFadeIn.setValue(0); // opacity: 0-->1
		Animated.timing(opacityFadeIn, {
			toValue: 1,
			duration: 400,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start();
	}, [imageUri]);

	return (
		<View style={styles.container}>
			<Animated.View style={[styles.background, { opacity: opacityFadeOut }]}>
				<Image style={styles.image} source={{ uri: prevImage }} />
			</Animated.View>

			<Animated.View style={[styles.background, { opacity: opacityFadeIn }]}>
				<Image style={styles.image} source={{ uri: imageUri }} />
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		flex: 1,
		width: '100%',
		height: windowHeight,
	},
	background: {
		position: 'absolute',
		backgroundColor: 'white',
		width: '100%',
		height: '100%',
	},
	image: {
		width: '100%',
		height: '100%',
	},
});

export default Background;
