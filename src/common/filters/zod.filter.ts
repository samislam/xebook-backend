import { ZodError } from 'zod'
import { Prisma } from '@/generated/prisma'
import { BaseExceptionFilter } from '@nestjs/core'
import { ZodSerializationException } from 'nestjs-zod'
import { extractFkFieldFromConstraint } from '@/lib/prisma/extract-fk-field'
import { DuplicateHttpException } from '@/classes/duplicate-exception.class'
import { ReferanceHttpException } from '@/classes/reference-exception.class'
import { ArgumentsHost, Logger, Catch, NotFoundException } from '@nestjs/common'
import { PRISMA_DUPLICATE_ERR, PRISMA_NOT_FOUND_ERR, PRISMA_REF_ERR } from '@/constants'

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError()

      if (zodError instanceof ZodError) {
        this.logger.error(`ZodSerializationException: ${zodError.message}`)
      }
    }

    super.catch(this.classifyException(exception), host)
  }

  private classifyException(exception: unknown) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case PRISMA_DUPLICATE_ERR:
          throw new DuplicateHttpException(this.extractDuplicateFields(exception))

        case PRISMA_REF_ERR:
          throw new ReferanceHttpException(this.extractReferenceFields(exception))

        case PRISMA_NOT_FOUND_ERR:
          throw new NotFoundException('Record not found')

        default:
          return exception
      }
    }

    return exception
  }

  private extractDuplicateFields(error: Prisma.PrismaClientKnownRequestError) {
    const target = error.meta?.target
    return Array.isArray(target) && target.length > 0 ? target.map(String) : ['unknown']
  }

  private extractReferenceFields(error: Prisma.PrismaClientKnownRequestError) {
    const constraint = error.meta?.constraint

    if (typeof constraint !== 'string') {
      return ['unknown']
    }

    return [extractFkFieldFromConstraint(constraint) ?? constraint]
  }
}
