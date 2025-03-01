import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { db } from '../drizzle/client'
import { users } from '../drizzle/schema/users'

interface RecoveryPasswordParams {
    token: string
    newPassword: string
}

export async function recoveryPassword({
    token,
    newPassword,
}: RecoveryPasswordParams) {
    try {
        const result = await db
            .select()
            .from(users)
            .where(eq(users.recoveryToken, token))
            .execute()

        if (result.length === 0) {
            throw new Error('Invalid or expired token')
        }

        const user = result[0]
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await db
            .update(users)
            .set({
                password: hashedPassword,
                recoveryToken: null,
                recoveryTokenExpiry: null,
            })
            .where(eq(users.id, user.id))
            .execute()

        return { message: 'Password updated successfully' }
    } catch (error) {
        throw new Error('Invalid or expired token')
    }
}
