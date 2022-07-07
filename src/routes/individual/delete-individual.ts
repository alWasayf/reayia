import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { Individual } from '@prisma/client';
import { prismaClient } from '../../prisma';

const tokenHeaders = Type.Object({
    token: Type.String(),
});
type tokenHeaders = Static<typeof tokenHeaders>;

export default async function (server: FastifyInstance) {   

	server.route({
		method: 'DELETE',
		url: '/individuals/delete',
		schema: {
			summary: 'delete a individual ',
			tags: ['Individual'],
            headers:tokenHeaders,
		},
		handler: async (request, reply) => {
		   const { token } = request.headers as tokenHeaders;
			server.jwt.verify(token, async function(err, decoded) {
				let d = decoded.id;  
			if(d){
			   return await prismaClient.individual.delete({
                where: {individual_id:d},
			});}
		}); },
	});
}