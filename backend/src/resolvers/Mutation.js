import bcrypt from 'bcrypt';
import dotenv from 'dotenv-defaults'
import jwt from 'jsonwebtoken'
// import {ObjectId} from 'mongodb'
import { v4 as uuidv4 } from 'uuid';
import { parse, join } from "path";
import { createWriteStream, unlink } from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const readFile = async (file, imageFilename) => {
    const {createReadStream, filename} = await file;
    const stream = createReadStream();
    // var {ext, name} = parse(filename);
    let url = join(__dirname, `../../DrawingImages/${imageFilename}.png`);
    const imageStream = createWriteStream(url)
    await stream.pipe(imageStream);

    const port = process.env.PORT || 4000
		const baseUrl = process.env.BASE_URL || 'http://localhost:'
    url = `${baseUrl}${port}/drawing-images${url.split('DrawingImages')[1]}`; // actually we don't need this field anymore!

    return url;
}

const getToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET || "default", { expiresIn: '30 days' });

const Mutation = {
	signUp: async (_, { input }, { UserModel }) => {
		const user = await UserModel.findOne({email: input.email});
		if (user) {
			throw new Error('Email Taken');
		}

		const hashedPassword = bcrypt.hashSync(input.password, 10);

		const newUser = await new UserModel({
			...input,
			password: hashedPassword,
			journals: []
		}).save();

		console.log(newUser);

		return {
			user: newUser,
			token: getToken(newUser)
		}
	},

	signIn: async (_, {input}, {UserModel}) => {
		const user = await UserModel.findOne({ email: input.email });
		const isAuthenticated = user && bcrypt.compareSync(input.password, user.password);

		if (!isAuthenticated) {
			throw new Error('Invalid credentials')
		}

		return {
			user,
			token: getToken(user)
		}
	},

	createJournal: async (_, {drawingImage}, {user, JournalModel}) => {
		if (!user) throw new Error('Authentication Error. Please sign in');

		const newJournal = new JournalModel({
			owner: user._id,
			date: new Date(),
			contents: [],
			drawingImage: '',
			shown: true
		})

		newJournal.drawingImage = await readFile(drawingImage, newJournal._id.toString());

		await newJournal.save();

		user.journals = [newJournal._id, ...user.journals];
		await user.save();
		return newJournal;
	},

	deleteJournal: async (_, {id}, {user, JournalModel}) => {
		if (!user) throw new Error('Authentication Error. Please sign in');

		await JournalModel.deleteOne({_id: id});
		user.journals = user.journals.filter(jid=>jid.toString() !== id);
		// notes: jid === ObjectId(id) will not work. since it actually compared using the object reference
		await user.save();
		let url = join(__dirname, `../../DrawingImages/${id}.png`);
		unlink(url, (err) => {
			if (err) throw err;
		});
		return true;

	},

	addJournalContent: async (_, {id, content}, {user, JournalModel}) => {
		if (!user) throw new Error('Authentication Error. Please sign in');
		if (!user.journals.some(jid=>jid.toString() == id)) throw new Error('Not owned by user');

		const journal = await JournalModel.findOne({_id: id});
		if (!journal) throw new Error('Journal ID non exist.')

		journal.contents = [...journal.contents, {
			id: uuidv4(),
			date: new Date(),
			content
		}]
		await journal.save();
		return journal.contents;
	},

	deleteJournalContent: async (_, {id, contentID}, {user, JournalModel}) => {
		if (!user) throw new Error('Authentication Error. Please sign in');
		if (!user.journals.some(jid=>jid.toString() == id)) throw new Error('Not owned by user');

		const journal = await JournalModel.findOne({_id: id});
		if (!journal) throw new Error('Journal ID non exist.')

		journal.contents = journal.contents.filter(j=>j.id !== contentID)

		await journal.save();
		return journal.contents;
	},

	updateJournalImage: async (_, {id, drawingImage}, {user,JournalModel}) => {
		if (!user) throw new Error('Authentication Error. Please sign in');
		if (!user.journals.some(jid=>jid.toString() == id)) throw new Error('Not owned by user');

		const journal = await JournalModel.findOne({_id: id});
		if (!journal) throw new Error('Journal ID non exist.')
		journal.drawingImage = await readFile(drawingImage, journal._id.toString());

		await journal.save();
		return journal;
	}
}

export default Mutation