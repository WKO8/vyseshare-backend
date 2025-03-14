import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { setServer } from '../functions/set-server'


export const setServerRoute: FastifyPluginAsyncZod = async app => {
    app.post(
        '/set-server',
        {
            schema: {
                summary: 'Define o dispositivo como o servidor',
                tags: ['server'],
                body: z.object({
                    serverIp: z.string().optional(),
                    uploadPath: z.string(),
                }),
                response: {
                    200: z.object({
                        message: z.string()
                    }),
                },
            },
        },
        async (request, reply) => {
            const { serverIp, uploadPath } = request.body
            
            const { message } = await setServer({serverIp, uploadPath})
            
            return reply.status(200).send({ message })
        }
    )
}
