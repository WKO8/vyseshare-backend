import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { db } from '../drizzle/client'
import { users } from '../drizzle/schema/users'
import { env } from '../env'

interface SigninParams {
    email: string
    password: string
}

export async function signin({ email, password }: SigninParams) {
    // Verificar se o usuário existe
    const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .execute()
    if (result.length === 0) {
        throw new Error('Credentials invalid')
    }

    const user = result[0]

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new Error('Credentials invalid')
    }

    // Gerar token JWT
    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET_KEY, {
        expiresIn: '1h',
    })

    return {
        token,
        userId: user.id,
    }
}
