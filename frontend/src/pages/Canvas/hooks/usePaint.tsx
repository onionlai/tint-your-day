import { useContext, createContext, useState } from 'react';

interface PaintContext {
	strokeWidth: number;
	setStrokeWidth: (w: number) => void;
	strokeColor: string;
	setStrokeColor: (c: string) => void;
}
const PaintContext = createContext<PaintContext | null>(null);

const PaintProvider = ({ children }) => {
	const [strokeWidth, setStrokeWidth] = useState(60);
	const [strokeColor, setStrokeColor] = useState('rgba(210, 220, 250, 0.4)');

	return (
		<PaintContext.Provider
			value={{
				strokeWidth,
				setStrokeWidth,
				strokeColor,
				setStrokeColor,
			}}
		>
			{children}
		</PaintContext.Provider>
	);
};

const usePaint = () => useContext(PaintContext);

const color = [
	{
		name: 'blue',
		color: 'rgba(210, 220, 250, 0.4)',
		buttonColor: 'rgb(210, 220, 250)',
	},
	{
		name: 'green',
		color: 'rgba(223, 255, 186, 0.4)',
		buttonColor: 'rgb(230, 255, 207)',
	},
	{
		name: 'yellow',
		color: 'rgba(254, 247, 199, 0.4)',
		buttonColor: 'rgb(255, 247, 179)',
	},
	{
		name: 'red',
		color: 'rgba(255, 209, 209, 0.4)',
		buttonColor: 'rgb(255, 209, 208)',
	},
	{
		name: 'grey',
		color: 'rgba(221, 221, 221, 0.4)',
		buttonColor: 'rgb(220, 220, 220)',
	},
];

export { PaintProvider, usePaint, color };
