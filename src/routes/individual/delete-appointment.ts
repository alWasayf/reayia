import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { prismaClient } from '../../prisma';

const AppointmentParams = Type.Object({
	appointment_id: Type.String(),
});
type AppointmentParams = Static<typeof AppointmentParams >;
export default async function (server: FastifyInstance) {
	server.route({
		method: 'DELETE',
		url:'/appointments/:appointment_id',
		schema: {
			summary: 'Deletes a appointment',
			tags: ['Appointments'],
			params: AppointmentParams
		},
		handler: async (request, reply) => {
			const {appointment_id} = request.params as AppointmentParams;
			return prismaClient.appointment.delete({
				where: { appointment_id },
			});
		},
	});
}