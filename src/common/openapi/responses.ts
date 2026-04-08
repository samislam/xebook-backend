import { Type } from '@nestjs/common'
import { applyDecorators } from '@nestjs/common'
import { ApiCreatedResponse, ApiResponseOptions } from '@nestjs/swagger'
import { ApiOkResponse, getSchemaPath, ApiExtraModels } from '@nestjs/swagger'

function buildWrappedDataSchema(model: Type<unknown>) {
  return {
    type: 'object',
    required: ['data'] as string[],
    properties: {
      data: {
        $ref: getSchemaPath(model),
      },
    },
  }
}

function buildPaginatedSchema(model: Type<unknown>) {
  return {
    type: 'object',
    required: [
      'total',
      'perPage',
      'page',
      'totalPages',
      'isFirstPage',
      'isLastPage',
      'count',
      'data',
    ] as string[],
    properties: {
      total: { type: 'integer', example: 3 },
      perPage: { type: 'integer', example: 20 },
      page: { type: 'integer', example: 1 },
      totalPages: { type: 'integer', example: 1 },
      isFirstPage: { type: 'boolean', example: true },
      isLastPage: { type: 'boolean', example: true },
      count: { type: 'integer', example: 3 },
      data: {
        type: 'array',
        items: {
          $ref: getSchemaPath(model),
        },
      },
    },
  }
}

export function ApiWrappedOkResponse(
  model: Type<unknown>,
  options?: Omit<ApiResponseOptions, 'schema'>
) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      ...options,
      schema: buildWrappedDataSchema(model),
    })
  )
}

export function ApiWrappedCreatedResponse(
  model: Type<unknown>,
  options?: Omit<ApiResponseOptions, 'schema'>
) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiCreatedResponse({
      ...options,
      schema: buildWrappedDataSchema(model),
    })
  )
}

export function ApiPaginatedResponse(
  model: Type<unknown>,
  options?: Omit<ApiResponseOptions, 'schema'>
) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      ...options,
      schema: buildPaginatedSchema(model),
    })
  )
}
