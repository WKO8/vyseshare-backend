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
    },
    uploadPath: string
    serverIp: string
}

export async function uploadFiles({ data, uploadPath, serverIp }: UploadFilesParams) {
    const fileId = randomUUID()
    const filePath = path.join(uploadPath, `${fileId}-${data.filename}`)

    // Criando diretório se não existir
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true })

    // Lendo o arquivo como buffer e salvando no sistema de arquivos
    const buffer = await data.toBuffer()
    await fs.promises.writeFile(filePath, buffer)

    // Gerando URL de acesso ao arquivo
    const fileUrl = `http://${serverIp}:8888/uploads/${fileId}-${data.filename}`

    // Obtendo o tamanho do arquivo diretamente do sistema de arquivos
    const fileSize = fs.statSync(filePath).size

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
