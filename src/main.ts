import chalk from 'chalk'
import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'
import appConfig from '@/config/app.config'
import { formatUrl } from './utils/formatUrl'
import { ConfigService } from '@nestjs/config'
import { cleanupOpenApiDoc } from 'nestjs-zod'
import { VersioningType } from '@nestjs/common'
import { Environment } from './server/environment-schema'
import { apiReference } from '@scalar/nestjs-api-reference'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { cleanupSdkOpenApiDoc } from '@/common/openapi/cleanup-openapi-doc'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: true,
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-User-Agent'],
  })

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  })

  if (appConfig.apiPrefix) {
    app.setGlobalPrefix(appConfig.apiPrefix)
  }

  const openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(appConfig.appName)
      .setDescription(appConfig.appDescription)
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
    {
      ignoreGlobalPrefix: false,
      operationIdFactory: (controllerKey, methodKey, version) => {
        const controller = controllerKey.replace('Controller', '')
        const normalizedController = controller.charAt(0).toLowerCase() + controller.slice(1)
        const rawVersion = Array.isArray(version) ? version[0] : version ?? '1'
        const normalizedVersion = String(rawVersion).replace(/^v/i, '')
        const normalizedMethod = methodKey.charAt(0).toUpperCase() + methodKey.slice(1)
        return normalizedController + normalizedMethod + 'V' + normalizedVersion
      },
    }
  )

  const cleanedOpenApiDoc = cleanupSdkOpenApiDoc(cleanupOpenApiDoc(openApiDoc, { version: '3.0' }))

  SwaggerModule.setup(appConfig.apiPrefix, app, cleanedOpenApiDoc, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  app.use(
    '/docs',
    apiReference({
      theme: 'default',
      content: cleanedOpenApiDoc,
    })
  )

  const configService = app.get(ConfigService<Environment, true>)
  const HOST = configService.get('HOST', { infer: true })
  const PORT = configService.get('PORT', { infer: true })
  await app.listen(PORT, HOST, () => {
    const url = formatUrl(HOST, PORT)
    console.log(`\nService listening on ${chalk.bold.underline(url)}\n`)
  })
}
bootstrap()
