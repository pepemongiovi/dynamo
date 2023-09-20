import assert from 'assert'

export function requireBuildEnv(
  key: string,
  value: string | undefined
): string {
  assert(value, `${key} is unset`)
  return value
}

export function requireEnv(key: string): string {
  return requireBuildEnv(key, process.env[key])
}

export const capitalizeString = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

export const clamp = (min: number, max: number, value: number) => {
  return Math.min(Math.max(min, value), max)
}

export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const res = {} as unknown as Pick<T, K>
  for (const key of keys) {
    res[key] = obj[key]
  }
  return res
}

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const res = {...obj}
  for (const key of keys) {
    delete res[key]
  }
  return res as Omit<T, K>
}
