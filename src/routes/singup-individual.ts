import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { prismaClient } from '../prisma';

const LoginIndiv = Type.Object({
	first_name:Type.String(),
	last_name:Type.String(),
	age:Type.Number(),
	number_children:Type.Number(),
	phone: Type.String(),
	password: Type.String(),
});
type LoginIndiv = Static<typeof LoginIndiv>;
export default async function (server: FastifyInstance) {
	server.route({
		method: 'POST',
		url: '/individual/login',
		schema: {
			summary: 'Login a individual and returns a token',
			body:LoginIndiv,
		},
		handler: async (request, reply) => {
			const { first_name,last_name, age ,number_children,phone, password } = request.body as LoginIndiv;

			const individual = await prismaClient.individual.findFirst({
				where: {
					phone:phone,
				},
			});
			if (!individual) {
				const result = await prismaClient.individual.create({
					data: {
						first_name: first_name,
						last_name:last_name,
						age:  age     ,
				     	number_children:number_children ,
						phone: phone,
						password:password,

					},
				});

				const token = server.jwt.sign({
					id: result.individual_id,
					phone: result.phone,

				});

				return {
					id: result.individual_id,
					token,
					type: 'SignUp',
				};
			} else {
				if (individual.password !== password) {
					reply.unauthorized();
					return;
				}

				const token = server.jwt.sign({
					id:individual.individual_id,
					phone:individual.phone,

				});

				return {
					token,
					id: individual.individual_id,
					type: 'SignIn',
				};
			}
		},
	});
}