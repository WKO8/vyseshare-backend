import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../drizzle/client'
import { files } from '../drizzle/schema/files'
import { uploadFiles } from '../functions/upload-files'
import { redis } from '../redis/client'

const pump = promisify(pipeline)

export const uploadFilesRoute: FastifyPluginAsyncZod = async app => {
    app.post(
        '/upload',
        {
            schema: {
                summary: 'Upload a new file to the server',
                tags: ['upload', 'files'],
                description: 'Upload a new file and store it in the server',
                consumes: ['multipart/form-data'],
                response: {
                    201: z.object({
                        fileId: z.string(),
                        filename: z.string(),
                        url: z.string(),
                    }),
                    400: z.object({
                        error: z.string(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const data = await request.file()

            if (!data) {
                return reply.status(400).send({ error: 'No file uploaded.' })
            }

            try {
                const result = await uploadFiles({ data })
                return reply.status(201).send(result)
            } catch (err) {
                return reply.status(500).send({ error: String(err) })
            }
        }
    )
}
