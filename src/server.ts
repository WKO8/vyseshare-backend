import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
    type ZodTypeProvider,
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { recoveryPasswordRoute } from './routes/recovery-password-route'
import { sendRecoveryPasswordEmailRoute } from './routes/send-recovery-password-email-route'
import { signinRoute } from './routes/signin-route'
import { signupRoute } from './routes/signup-route'
import fastifyMultipart from '@fastify/multipart'
import { uploadFilesRoute } from './routes/upload-files-route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
    origin: 'http://localhost:8888',
})

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'VyseNet',
            version: '0.0.1',
            description: 'API da aplicação VyseNet',
        },
    },
    transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})

app.register(fastifyMultipart)

app.register(signupRoute)
app.register(signinRoute)
app.register(sendRecoveryPasswordEmailRoute)
app.register(recoveryPasswordRoute)
app.register(uploadFilesRoute)

app.get('/', () => {
    return 'Hello world'
})

app.listen({ port: env.PORT }).then(() => {
    console.log(`Server listening on http://localhost:${env.PORT}`)
})
