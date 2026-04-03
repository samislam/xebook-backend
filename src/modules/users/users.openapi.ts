import { UpdateUserDto } from '@/users/dto/update-user.dto'
import { ChangePasswordDto } from '@/users/dto/change-password.dto'
import { ChangeUsernameDto } from '@/users/dto/change-username.dto'
import { CreateUserRequestDto } from '@/users/dto/create-user-request.dto'
import { ApiBodyOptions, ApiOperationOptions, ApiParamOptions } from '@nestjs/swagger'

export const usersCreateOperation: ApiOperationOptions = {
  summary: 'Create user',
  description: 'Create a new internal user.',
}
export const usersCreateBody: ApiBodyOptions = { type: CreateUserRequestDto }

export const usersListOperation: ApiOperationOptions = {
  summary: 'List users',
  description: 'List internal users with pagination and filters.',
}

export const usersFindOneOperation: ApiOperationOptions = {
  summary: 'Get user by ID',
  description: 'Fetch one internal user by id.',
}
export const usersUpdateOperation: ApiOperationOptions = {
  summary: 'Update user by ID',
  description: 'Update mutable profile fields for one internal user.',
}
export const usersUpdateBody: ApiBodyOptions = { type: UpdateUserDto }
export const usersChangePasswordOperation: ApiOperationOptions = {
  summary: 'Change user password by ID',
  description: 'Change the password of a specific internal user.',
}
export const usersChangePasswordBody: ApiBodyOptions = { type: ChangePasswordDto }
export const usersChangeUsernameOperation: ApiOperationOptions = {
  summary: 'Change user username by ID',
  description: 'Change the username of a specific internal user.',
}
export const usersChangeUsernameBody: ApiBodyOptions = { type: ChangeUsernameDto }
export const usersFreezeOperation: ApiOperationOptions = {
  summary: 'Freeze user by ID',
  description: 'Freeze a user account by setting it inactive.',
}
export const usersUnfreezeOperation: ApiOperationOptions = {
  summary: 'Unfreeze user by ID',
  description: 'Unfreeze a user account by setting it active.',
}
export const usersRemoveOperation: ApiOperationOptions = {
  summary: 'Delete user by ID',
  description: 'Hard delete a user when foreign-key constraints allow it.',
}

export const userIdParam: ApiParamOptions = {
  name: 'id',
  description: 'User id',
}

export const meFindOperation: ApiOperationOptions = {
  summary: 'Get me',
  description: 'Fetch the currently authenticated internal user.',
}
export const meUpdateOperation: ApiOperationOptions = {
  summary: 'Update me',
  description: 'Update mutable profile fields for the currently authenticated user.',
}
export const meUpdateBody: ApiBodyOptions = { type: UpdateUserDto }
export const meChangePasswordOperation: ApiOperationOptions = {
  summary: 'Change my password',
  description: 'Change the password of the currently authenticated user.',
}
export const meChangePasswordBody: ApiBodyOptions = { type: ChangePasswordDto }
export const meChangeUsernameOperation: ApiOperationOptions = {
  summary: 'Change my username',
  description: 'Change the username of the currently authenticated user.',
}
export const meChangeUsernameBody: ApiBodyOptions = { type: ChangeUsernameDto }
