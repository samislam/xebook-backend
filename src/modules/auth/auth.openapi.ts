import { ApiOperationOptions } from '@nestjs/swagger'

export const authRegisterOperation: ApiOperationOptions = {
  summary: 'Register',
  description: 'Create a new internal user account and return the authenticated session payload.',
}

export const authLoginOperation: ApiOperationOptions = {
  summary: 'Login',
  description:
    'Authenticate with username and password and return the authenticated session payload.',
}

export const authMeOperation: ApiOperationOptions = {
  summary: 'Get current auth user',
  description: 'Return the currently authenticated JWT user payload.',
}
