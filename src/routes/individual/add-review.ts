import { Review} from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { prismaClient } from '../../prisma';

const Review =Type.Object({
	review:Type.String(),
	rating:Type.Number(),
	reviewBabysitter_id:Type.String(),
});
const toksenheaders=Type.Object({
	token : Type.String(),
})
type toksenheaders = Static<typeof toksenheaders>;
export default async function (server: FastifyInstance) {
	server.route({
		method: 'POST',
		url: '/individual/reviews',
		schema: {
			summary: 'Creates new review',
			tags: ['Reviews'],
			body:Review,
			headers:toksenheaders,
		},
		handler: async (request, reply) => {
			const review = request.body as Review;
			const {token} = request.headers as toksenheaders
			server.jwt.verify(token, async function name(err, decoded) {
				let id = decoded.id;
				if(id){
					return await prismaClient.review.create({
						data:{
							reviewIndividual_id: id,
							review:review.review,
							rating:review.rating,
							reviewBabysitter_id:review.reviewBabysitter_id,
						}
					});
				}
			})
		},
	});
}