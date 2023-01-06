import * as fs from 'fs';
import dotenv from 'dotenv-defaults';
import { DateTimeResolver, DateTimeTypeDefinition } from 'graphql-scalars';
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";

import jwt from 'jsonwebtoken';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';

import UserModel from './models/user.js';
import JournalModel from './models/journal.js';
import Mutation from './resolvers/Mutation.js';
import { Query } from './resolvers/Query.js';
import mongo from './mongo.js';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const getUserFromToken = async (token, UserModel) => {
	if (!token) return null; // signIn, signUp don't need token

	const tokenData = jwt.verify(token, process.env.JWT_SECRET || "default");
	return await UserModel.findOne({ _id: tokenData.id });
};

const server = new ApolloServer({
	typeDefs: [
		DateTimeTypeDefinition,
		'scalar Upload',
		fs.readFileSync('./src/schema.graphql', 'utf-8'),
	],
	resolvers: {
		Query,
		Mutation,
		DateTime: DateTimeResolver,
		Upload: GraphQLUpload
	},
});

mongo.connect();

const startServer = async () => {
	const app = express();
	app.use('/drawing-images', express.static(join(__dirname, '..', 'DrawingImages')));

	const httpServer = http.createServer(app);
	await server.start();

	app.use(
		'/graphql',
		cors(),
		graphqlUploadExpress(),
		bodyParser.json(),
		expressMiddleware(server, {
			context: async ({ req }) => {
				const user = await getUserFromToken(req.headers.token, UserModel);
				return {
					UserModel,
					JournalModel,
					user,
				};
			},
			listen: { port: process.env.PORT || 4000 },
		})
	);

	const port = process.env.PORT || 4000;
	await new Promise((resolve) => httpServer.listen({ port }, resolve));

	console.log(`🚀 Server ready at http://localhost:${port}`);
};
startServer();
