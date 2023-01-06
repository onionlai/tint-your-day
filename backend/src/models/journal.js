import mongoose from "mongoose";
const Schema = mongoose.Schema;

const JournalSchema = new Schema({
	owner: {type: mongoose.Types.ObjectId, ref: "User"}, // dummy
	date: !{ type: Date, required: [true]},
	contents: ![
		{
			date: { type: Date, required: [true]},
			content: { type: String, required: [true]},
		}
	],
	drawingImage: !{ type: String },
	shown: !{ type: Boolean, required: [true]},

});
const JournalModel = mongoose.model("Journal", JournalSchema);

export default JournalModel;