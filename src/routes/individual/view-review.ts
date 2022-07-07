import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import _ from 'lodash';
//import { addAuthorization } from '../hooks/auth';
import { prismaClient } from '../../prisma';

const BabySitterParams = Type.Object({
	babysitter_id:Type.String(),
});

type BabySitterParams = Static<typeof BabySitterParams>;

export default async function (server: FastifyInstance) {
    server.route({
		method: 'GET',
		url: '/babySitter/reviews/:babysitter_id',
		schema: {
			summary: 'Returns review',
			tags: ['Reviews'],
			params: BabySitterParams,
		},
		handler: async (request, reply) => {
			const { babysitter_id } = request.params as BabySitterParams;
			return prismaClient.babysitter.findMany({
				where: { babysitter_id },
			});
		},
	});
}