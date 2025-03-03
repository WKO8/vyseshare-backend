import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { db } from '../drizzle/client'
import { files } from '../drizzle/schema/files'
import { redis } from '../redis/client'

const pump = promisify(pipeline)

interface UploadFilesParams {
    data: {
        filename: string
        mimetype: string
        file: NodeJS.ReadableStream
        toBuffer: () => Promise<Buffer>
    }
}

export async function uploadFiles({ data }: UploadFilesParams) {
    const fileId = randomUUID()
    const uploadDir = path.join(__dirname, '../uploads')
    const filePath = path.join(uploadDir, `${fileId}-${data.filename}`)

    // Criando diretório se não existir
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

    // Salvando arquivo no sistema de arquivos
    await pump(data.file, fs.createWriteStream(filePath))

    // Gerando URL de acesso ao arquivo
    const fileUrl = `http://localhost:8888/uploads/${fileId}-${data.filename}`

    const fileBuffer = await data.toBuffer()
    const fileSize = fileBuffer.length

    // Salvando metadados no PostgreSQL
    await db.insert(files).values({
        id: fileId,
        filename: data.filename,
        mimetype: data.mimetype,
        path: filePath,
        url: fileUrl,
        size: fileSize,
        uploadedAt: new Date(),
    })

    // Cacheando no Redis (expiração de 1 hora)
    await redis.set(
        `file:${fileId}`,
        JSON.stringify({
            fileId,
            filename: data.filename,
            url: fileUrl,
        }),
        'EX',
        3600
    )

    return { fileId, filename: data.filename, url: fileUrl }
}
