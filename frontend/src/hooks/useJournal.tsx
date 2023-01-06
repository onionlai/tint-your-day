import { createContext, useState, useContext } from 'react';

export interface IJournal {
	id: string;
	date: string;
	contents: {
		date: string;
		content: string;
	}[];
	drawingImage: string;
	shown: boolean;
}

export interface IContent {
	id: string;
	date: string;
	content: string;
}

interface JournalContext {
	journals: IJournal[];
	setJournals: (j: IJournal[]) => void;
	contents: IContent[];
	setContents: (c: IContent[]) => void;
}

const JournalContext = createContext<JournalContext | null>(null);

const JournalProvider = ({ children }) => {
	const [journals, setJournals] = useState<IJournal[]>([]);
	const [contents, setContents] = useState<IContent[]>([]); // full contents for currently open journal

	return (
		<JournalContext.Provider
			value={{
				journals,
				setJournals,
				contents,
				setContents,
			}}
		>
			{children}
		</JournalContext.Provider>
	);
};

const useJournal = () => useContext(JournalContext);
export { JournalProvider, useJournal };
