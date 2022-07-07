import { Babysitter } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import Fuse from 'fuse.js';
import { prismaClient } from '../../prisma';

const GetBabySittersQuery = Type.Object({
	nationality:Type.Optional(Type.String()),
});
type GetBabySittersQuery = Static<typeof GetBabySittersQuery >;
export default async function (server: FastifyInstance) {
	/// Get all babysitters or search by nationality
	server.route({
		method: 'GET',
		url: '/individual/babysitters/search',
		schema: {
			summary: 'Get all babysitters or search by nationality ',
			tags: ['Babysitters'],
			querystring: GetBabySittersQuery,
		},
		handler: async (request, reply) => {
			const query = request.query as GetBabySittersQuery;
			const babysitters = await prismaClient.babysitter.findMany();
			if (!query.nationality) return babysitters;
			const fuse = new Fuse(babysitters, {
				includeScore: true,
				isCaseSensitive: false,
				includeMatches: true,
				findAllMatches: true,
				threshold: 1,
				keys: ['nationality'],
			});
			console.log(JSON.stringify(fuse.search(query.nationality)));
			const result: Babysitter[] = fuse.search(query.nationality).map((r) => r.item);
			return result;
		},
	});
}