import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { Individual } from '@prisma/client';
import { prismaClient } from '../../prisma';

const Individual= Type.Object({
	individual_id:Type.String(),
	first_name   :Type.String()  ,
	last_name :Type.String()  ,   
	age     :Type.Number(),        
	password :Type.String(),
	phone :Type.String(),
	number_children:Type.Number()
});
const PartialIndividual=Type.Partial(Individual);
type PartialIndividual = Static<typeof PartialIndividual>;
const tokenHeaders = Type.Object({
    token: Type.String(),
});
type tokenHeaders = Static<typeof tokenHeaders>;

export default async function (server: FastifyInstance) {   
	/// Update one by id
	server.route({
		method: 'PATCH',
		url: '/individuals',
		schema: {
			summary: 'Update a individual by id + you do not need to pass all properties',
			tags: ['Individual'],
			body: PartialIndividual, 
            headers:tokenHeaders,
		},
		handler: async (request, reply) => {
            const individual = request.body as Individual;
		    const { token } = request.headers as tokenHeaders;
			server.jwt.verify(token,   async function(err, decoded) {
				let d = decoded.id;  
			if(d){
			   return await prismaClient.individual .update({
                where: {individual_id:d},
                	data: individual ,
			});}
		}); },
	});
}