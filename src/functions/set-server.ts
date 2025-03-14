import fs from 'node:fs'
import os from 'node:os'
import { redis } from "../redis/client";

interface SetServerParams {
    serverIp?: string
    uploadPath: string
}

export async function setServer({
    serverIp,
    uploadPath
}: SetServerParams) {
    let localIp = serverIp ?? "";
    if (!serverIp) {
        const networkInterfaces = os.networkInterfaces()
        localIp = Object.values(networkInterfaces)
            .flat()
            .find(iface => iface?.family === 'IPv4' && !iface.internal)?.address || '127.0.0.1'
    }

    await redis.set('server:ip', localIp);
    await redis.set('server:uploadPath', uploadPath)

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true })
    }
    
    return {
        message: 'Servidor configurado com sucesso!',
    }
}
