import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { sendRecoveryPasswordEmail } from '../functions/send-recovery-password-email'

export const sendRecoveryPasswordEmailRoute: FastifyPluginAsyncZod =
    async app => {
        app.post(
            '/recovery',
            {
                schema: {
                    summary: 'Send recovery password email',
                    tags: ['recovery-password'],
                    description:
                        'Send an email to the user to recover the password',
                    body: z.object({
                        email: z.string().email(),
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
                const { email } = request.body

                try {
                    const { message } = await sendRecoveryPasswordEmail({
                        email,
                    })
                    return reply.status(200).send({ message })
                } catch (error) {
                    const errorMessage =
                        error instanceof Error ? error.message : 'Unknown error'
                    return reply.status(401).send({ error: errorMessage })
                }
            }
        )
    }
