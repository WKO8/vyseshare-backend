import { db } from "../drizzle/client"
import { users } from "../drizzle/schema/users"


interface SignupParams {
    name: string
    email: string
    password: string
}

export async function signup({
    name,
    email,
    password,
}: SignupParams) {

    const result = await db.insert(users).values({
        name,
        email,
        password,
    }).returning()

    const user = result[0]

    return {
        userId: user.id
    }
}