/**
 * Extracts a foreign-key field name from common constraint naming styles.
 *
 * Supported examples:
 * - `Transaction_ownerUserId_fkey` -> `ownerUserId`
 * - `FK_Product_Service` with prefix `FK_Product_` -> `serviceId`
 */
export function extractFkFieldFromConstraint(constraint: string, fkPrefix?: string): string | undefined {
  const prismaStyleMatch = constraint.match(/^[^_]+_(.+)_fkey$/)
  if (prismaStyleMatch?.[1]) {
    return prismaStyleMatch[1]
  }

  if (!fkPrefix || !constraint.startsWith(fkPrefix)) {
    return undefined
  }

  const field = constraint.replace(fkPrefix, '').replace(/^[A-Z]/, (char) => char.toLowerCase())
  return field ? `${field}Id` : undefined
}
