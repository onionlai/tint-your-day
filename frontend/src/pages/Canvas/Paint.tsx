import {
	Path,
	Canvas,
	useTouchHandler,
	Blur,
	BlurMask,
} from '@shopify/react-native-skia';
import { useState } from 'react';
import { useDrawing } from './hooks/useDrawing';
import { usePaint } from './hooks/usePaint';
import { StyleSheet } from 'react-native';
import { windowHeight, windowWidth } from '../../data/constants';

interface IPath {
	path: string[];
	width: number;
	color: string;
}

const Paint = () => {
	const { pushNewPath } = useDrawing();
	const { strokeWidth, strokeColor } = usePaint();
	const [currentPath, setCurrentPath] = useState<IPath | null>(null);
	const [touchID, setTouchID] = useState(0);

	// @todo multitouch
	const touchHandler = useTouchHandler(
		{
			onStart: ({ x, y, id }) => {
				if (touchID !== 0) return;
				setTouchID(id);
				setCurrentPath({
					path: [`M ${x.toFixed(2)} ${y.toFixed(2)}`],
					width: strokeWidth,
					color: strokeColor,
				});
			},
			onActive: ({ x, y, id }) => {
				if (id !== touchID) return;
				if (!currentPath) return;

				setCurrentPath((currentPath) => ({
					...currentPath,
					path: [...currentPath.path, `L ${x.toFixed(2)} ${y.toFixed(2)}`],
				}));
			},
			onEnd: ({ id }) => {
				if (id !== touchID) return;

				if (currentPath && currentPath.path.length > 1) {
					pushNewPath(currentPath);
				}
				setTouchID(0);
				setCurrentPath(null);
			},
		},
		[currentPath, strokeColor]
	);

	return (
		<Canvas style={[styles.canvas, { zIndex: 2 }]} onTouch={touchHandler}>
			{currentPath && (
				<Path
					path={currentPath.path.join(' ')}
					strokeWidth={currentPath.width}
					color={currentPath.color}
					strokeCap="round"
					strokeJoin="round"
					style="stroke"
				>
					<Blur blur={2}></Blur>
					<BlurMask blur={8} style="inner" />
				</Path>
			)}
		</Canvas>
	);
};

export default Paint;

const styles = StyleSheet.create({
	canvas: {
		height: windowHeight,
		width: windowWidth,
		zIndex: 2,
		position: 'absolute',
	},
});
