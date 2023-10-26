export const getPlaceholder = (
  value?: string,
  femalePrefix?: boolean,
  actionLabel = 'Digite'
) => {
  if (!value) return undefined
  return `${actionLabel} ${femalePrefix ? 'a' : 'o'} ${value}...`
}

export function formatMoney(value: number, fractionDigits = 2): string {
  const num = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(value)
  return `R$ ${num}`
}

export function removeNonDigits(str: string, ignoreDash = false): string {
  const filteredStr = str.replace(ignoreDash ? /[^\d.(?!/)]/g : /[^\d.]/g, '')
  const i = filteredStr.indexOf('.') + 1
  return i === 0
    ? filteredStr
    : filteredStr.substring(0, i) + filteredStr.substring(i).replace(/\./g, '')
}
