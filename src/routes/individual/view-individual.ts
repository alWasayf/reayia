import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { prismaClient } from '../../prisma';

export default async function (server: FastifyInstance) {
		const tokenHeaders = Type.Object({
			token: Type.String(),
		});
		type tokenHeaders = Static<typeof tokenHeaders>;
		server.route({
			method: 'GET',
			url: '/individual',
			schema: {
				summary:'View all individual',
				tags: ['Individuals'],
				headers:tokenHeaders,
			},
			handler: async (request, reply) => {
				const { token } = request.headers as tokenHeaders;
				server.jwt.verify(token,   async function(err, decoded) {
					let d = decoded.id;  
				if(d){
					const i= await prismaClient.individual.findFirst({
					where: { individual_id:d},
				});
				console.log(i);
				reply.send(i);}
			}); },
		});
}