import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { signup } from '../functions/signup'
import { hash } from 'bcrypt'

export const signupRoute: FastifyPluginAsyncZod = async app => {
    app.post(
        '/signup',
        {
            schema: {
                summary: 'Sign up user in the database',
                tags: ['signup'],
                description: 'Register a new user to the database',
                body: z.object({
                    name: z.string().min(3).max(20),
                    email: z.string().email(),
                    password: z.string().min(8).max(20),
                }),
                response: {
                    201: z.object({
                        userId: z.string(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { name } = request.body

            
            // Hash da senha
            const salts = 10
            const hashedPassword = await hash(request.body.password, salts)
        
            const { userId } = await signup({
                name,
                email: request.body.email,
                password: hashedPassword,
            })

            return reply.status(201).send({
                userId
            })
        }
    )
}
