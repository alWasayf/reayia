import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { prismaClient } from '../prisma';

const LoginIndiv = Type.Object({
    phone: Type.String(),
    password: Type.String(),
});
type LoginIndiv = Static<typeof LoginIndiv>;
export default async function (server: FastifyInstance) {
    server.route({
        method: 'POST',
        url: '/individual/singin',
        schema: {
            summary: 'Login a individual and returns a token',
            body:LoginIndiv,
        },
        handler: async (request, reply) => {
            const { phone, password } = request.body as LoginIndiv;

            const individual = await prismaClient.individual.findFirst({
                where: {
                    phone:phone,
                },
            });
            if (!individual) {
                return ;
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