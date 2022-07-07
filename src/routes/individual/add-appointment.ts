import { Appointment} from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { prismaClient } from '../../prisma';

const Appointment =Type.Object({
	date:Type.String({format:"date-time"}),
	appointmentBabysitter_id:Type.String(),
});
const toksenheaders=Type.Object({
	token : Type.String(),
})
type toksenheaders = Static<typeof toksenheaders>;
export default async function (server: FastifyInstance) {
	server.route({
		method: 'POST',
		url: '/individual/appointments',
		schema: {
			summary: 'Creates new appointment',
			tags: ['Appointments'],
			body: Appointment,
			headers:toksenheaders,
		},
		handler: async (request, reply) => {
			const appointment = request.body as Appointment;
			const {token} = request.headers as toksenheaders;
			server.jwt.verify(token, async function name(err, decoded) {
				let id = decoded.id;
				if(id){
					return await prismaClient.appointment.create({
						data:{
							appointmentIndividual_id: id,
	                        date:appointment.date,
	                        appointment_status:appointment.appointment_status,
	                        appointmentBabysitter_id:appointment.appointmentBabysitter_id,
						}
					});
				}
			})

		},
	});
}