import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { recoveryPassword } from '../functions/recovery-password'

export const recoveryPasswordRoute: FastifyPluginAsyncZod = async app => {
    app.post(
        '/recovery/:token',
        {
            schema: {
                summary: 'Recovery/Change user password',
                tags: ['recovery-password'],
                description: 'Recovery/Change user password',
                body: z.object({
                    newPassword: z.string().min(8).max(20),
                }),
                params: z.object({
                    token: z.string()
                }),
                response: {
                    200: z.object({
                        message: z.string(),
                    }),
                    400: z.object({
                        error: z.string(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { token } = request.params
            const { newPassword } = request.body

            try {
                const { message } = await recoveryPassword({
                    token,
                    newPassword,
                })
                return reply.status(200).send({ message })
            } catch (error) {
                console.error('Recovery Password Error:', error)
                const errorMessage =
                    error instanceof Error ? error.message : 'Unknown error'

                // Se o erro for de autenticação, retorna 401, senão 500
                const statusCode = errorMessage.includes('Invalid token')
                    ? 401
                    : 500
                return reply.status(statusCode).send({ error: errorMessage })
            }
        }
    )
}
