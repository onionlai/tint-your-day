import { useContext, createContext, useState, useEffect } from 'react';

interface IPath {
	path: string[];
	width: number;
	color: string;
}

interface DrawingContext {
	completedPath: IPath[];
	setCompletedPath: (p: IPath[]) => void;
	undoPath: IPath[];
	setUndoPath: (p: IPath[]) => void;
	undoDisabled: boolean;
	setUndoDisabled: (u: boolean) => void;
	redoDisabled: boolean;
	setRedoDisabled: (u: boolean) => void;
	// image: SkImage;
	// setImage: (i: SkImage) => void;
	// canvasRef: any;
	pushNewPath: (p: IPath) => void;
	undo: () => void;
	redo: () => void;
	reset: () => void;
	// saveImage: (r: any) => void;
}

const DrawingContext = createContext<DrawingContext | null>(null);

const DrawingProvider = ({ children }) => {
	const [completedPath, setCompletedPath] = useState<IPath[]>([]);
	const [undoPath, setUndoPath] = useState<IPath[]>([]);
	const [undoDisabled, setUndoDisabled] = useState<boolean>(true);
	const [redoDisabled, setRedoDisabled] = useState<boolean>(true);

	// const [image, setImage] = useState<SkImage>();

	// const canvasRef = useCanvasRef();
	useEffect(() => {
		setUndoDisabled(completedPath.length === 0);
	}, [completedPath]);
	useEffect(() => {
		setRedoDisabled(undoPath.length === 0);
	}, [undoPath]);

	const pushNewPath = (newPath: IPath) => {
		setCompletedPath([...completedPath, newPath]);
		setUndoPath([]);
	};

	const undo = () => {
		if (completedPath.length === 0) return;
		var lastPath = completedPath[completedPath.length - 1];
		setUndoPath([...undoPath, lastPath]);
		setCompletedPath(completedPath.slice(0, -1));
	};

	const redo = () => {
		if (undoPath.length === 0) return;
		var lastUndoPath = undoPath[undoPath.length - 1];
		setCompletedPath([...completedPath, lastUndoPath]);
		setUndoPath(undoPath.slice(0, -1));
	};

	const reset = () => {
		setCompletedPath([]);
		setUndoPath([]);
	};

	return (
		<DrawingContext.Provider
			value={{
				completedPath,
				setCompletedPath,
				undoPath,
				setUndoPath,
				undoDisabled,
				setUndoDisabled,
				redoDisabled,
				setRedoDisabled,
				// image,
				// setImage,
				// canvasRef,
				pushNewPath,
				undo,
				redo,
				reset,
				// saveImage: onSave,
			}}
		>
			{children}
		</DrawingContext.Provider>
	);
};

const useDrawing = () => useContext(DrawingContext);

export { DrawingProvider, useDrawing };
