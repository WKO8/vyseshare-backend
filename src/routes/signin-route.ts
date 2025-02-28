import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { signin } from '../functions/signin'

export const signinRoute: FastifyPluginAsyncZod = async app => {
    app.post(
        '/signin',
        {
            schema: {
                summary: 'Sign in user',
                tags: ['signin'],
                description: 'Authenticate a user and return a JWT token',
                body: z.object({
                    email: z.string().email(),
                    password: z.string().min(8).max(20),
                }),
                response: {
                    200: z.object({
                        token: z.string(),
                        userId: z.string(),
                    }),
                    400: z.object({
                        error: z.string(),
                    })
                },
            },
        },
        async (request, reply) => {
            const { email, password } = request.body

            try {
                const { token, userId } = await signin({ email, password })
                return reply.status(200).send({ token, userId })
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                return reply.status(401).send({ error: errorMessage })
            }
        }
    )
}
