import fs from 'node:fs'
import path from 'node:path'
import type { FastifyPluginAsync } from 'fastify'
import z from 'zod'
import { redis } from '../redis/client'

export const downloadFilesRoute: FastifyPluginAsync = async app => {
    app.get(
        '/download/:filename',
        {
            schema: {
                summary: 'Download a file from the server',
                tags: ['download', 'files'],
                description:
                    'Fetches a file stored in the server and returns it to the client',
                params: z.object({
                    filename: z.string(),
                }),
                response: {
                    200: z.object({
                        file: z.string(),
                        type: z.boolean(),
                    }),
                    404: z.object({
                        error: z.string(),
                    }),
                },
            },
        },

        async (request, reply) => {
            const { filename } = request.params as { filename: string }

            // Recupera o caminho da pasta do servidor a partir do Redis
            const uploadPath = await redis.get('server:uploadPath')
            if (!uploadPath) {
                return reply
                    .status(400)
                    .send({ error: 'No server directory set' })
            }

            // Caminho completo do arquivo
            const filePath = path.join(uploadPath, filename)

            // Verifica se o arquivo existe
            if (!fs.existsSync(filePath)) {
                return reply.status(404).send({ error: 'File not found' })
            }

            // Envia o arquivo
            const fileStream = fs.createReadStream(filePath)
            reply.header(
                'Content-Disposition',
                `attachment; filename="${filename}"`
            )
            reply.type('application/octet-stream')
            return reply.send(fileStream)
        }
    )
}
