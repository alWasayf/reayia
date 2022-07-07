import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { prismaClient } from '../../prisma';

const ReviewParams = Type.Object({
	review_id: Type.String(),
});
type ReviewParams = Static<typeof ReviewParams>;
export default async function (server: FastifyInstance) {
	server.route({
		method: 'DELETE',
		url:'/reviews/:review_id',
		schema: {
			summary: 'Deletes a reviews',
			tags: ['Reviews'],
			params: ReviewParams,
		},
		handler: async (request, reply) => {
			const { review_id } = request.params as ReviewParams;
			return prismaClient.review.delete({
				where: { review_id },
			});
		},
	});
}