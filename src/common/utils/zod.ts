export const omitEmptyField = (value: unknown) => {
  return typeof value === 'string' && value.trim() === '' ? undefined : value
}

export const emptyStringToNull = (value: unknown) => {
  return typeof value === 'string' && value.trim() === '' ? null : value
}

export const stringToBoolean = (value: unknown) => {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true') {
      return true
    }
    if (normalized === 'false') {
      return false
    }
  }

  return value
}
