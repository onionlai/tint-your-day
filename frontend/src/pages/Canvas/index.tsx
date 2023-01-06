import { DrawingProvider } from './hooks/useDrawing';
import { PaintProvider } from './hooks/usePaint';
import DrawCanvas from './DrawCanvas';

const MyCanvas = ({ route, navigation }) => {
	return (
		<DrawingProvider>
			<PaintProvider>
				<DrawCanvas route={route} navigation={navigation} />
			</PaintProvider>
		</DrawingProvider>
	);
};

export default MyCanvas;
