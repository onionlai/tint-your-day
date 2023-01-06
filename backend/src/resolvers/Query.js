const Query = {
	getJournalList: async (_, __, { user }) => {
		if (!user) throw new Error('Authentication Error. Please sign in');
		await user.populate('journals');
		const journalList = user.journals.map(journal => {
			// console.log(journal);
			return {
				id: journal._id,
				date: journal.date,
				contents: journal.contents.slice(0, 1), // only query one to speed up
				drawingImage: journal.drawingImage,
				shown: journal.shown
			}
		})
		// console.log(journalList);
		return journalList;
	},

	getJournalContents: async (_, { id }, { user, JournalModel }) => {
		if (!user) throw new Error('Authentication Error. Please sign in');
		if (!user.journals.some(jid => jid.toString() == id)) throw new Error('Not owned by user');

		const journal = await JournalModel.findOne({ _id: id });
		return journal.contents
	},

	getUserInfo: async (_, __, { user }) => {
		if (!user) throw new Error('Authentication Error. Please sign in');
		return user // @todo password should not show up
	}
};

export { Query };
