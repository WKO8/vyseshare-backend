import { eq } from 'drizzle-orm'
import { createTransport } from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../drizzle/client'
import { users } from '../drizzle/schema/users'
import { env } from '../env'

interface SendRecoveryPasswordEmailParams {
    email: string
}

export async function sendRecoveryPasswordEmail({
    email,
}: SendRecoveryPasswordEmailParams) {
    const transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            type: 'OAuth2',
            user: env.MAIL_USERNAME_FROM,
            clientId: env.OAUTH_CLIENT_ID,
            clientSecret: env.OAUTH_CLIENT_SECRET,
            refreshToken: env.OAUTH_REFRESH_TOKEN,
        },
    })

    // Verificar se o usuário existe
    const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .execute()

    if (result.length === 0) {
        throw new Error('Usuário não encontrado')
    }

    const user = result[0]
    
    const token = uuidv4()

    // Atualizar o token de recuperação
    await db
        .update(users)
        .set({
            recoveryToken: token,
            recoveryTokenExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
        })
        .where(eq(users.id, user.id))

    const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: email,
        subject: 'Recuperação de senha - VyseNet',
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                <h2>Recuperação de senha</h2>
                <p>Olá,</p>
                <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para continuar:</p>
                <a href="http://localhost:8888/recovery/${token}" 
                   style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
                   Redefinir Senha
                </a>
                <p>Se você não solicitou a recuperação de senha, por favor ignore este email.</p>
                <p>Atenciosamente,<br/>Equipe VyseNet</p>
            </div>
        `,
    }

    transporter.sendMail(mailOptions, err => {
        if (err) {
            console.log('Error: ', err)
        }
    })

    return { message: 'Email sent successfully' }
}
