import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { prismaClient } from '../../prisma';

const toksenheaders=Type.Object({
	token : Type.String(),
})
type toksenheaders = Static<typeof toksenheaders>;
export default async function (server: FastifyInstance) {
    server.route({
		method: 'GET',
		url: '/babySitter/appointments/view',
		schema: {
			summary: 'Returns appointments',
			tags: ['Appointments'],
			headers:toksenheaders,
		},
		handler: async (request, reply) => {
            const {token} = request.headers as toksenheaders;
            server.jwt.verify(token, async function name(err, decoded) {
                console.log("hi")
				let id = decoded.id;
				if(id){
                    console.log(id)
					return await prismaClient.appointment.findMany({
                         where:{appointmentIndividual_id:id}
					});
				}

			})

		},
	});
}