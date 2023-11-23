export type PartiallyRequired<T, P extends keyof T> = {
  [K in P]-?: NonNullable<T[K]>
} & {
  [K in Exclude<keyof T, P>]: T[K]
}

export type Nullable<T> = T | null
export type Nullish<T> = Nullable<T> | undefined

export const shiftOpts = [
  {value: 'Diurno', label: 'Qualquer horário'},
  {value: 'Manhã', label: 'Manhã'},
  {value: 'Tarde', label: 'Tarde'}
]
export const statesOpts = [
  {name: 'Acre', shortName: 'AC'},
  {name: 'Alagoas', shortName: 'AL'},
  {name: 'Amapá', shortName: 'AP'},
  {name: 'Amazonas', shortName: 'AM'},
  {name: 'Bahia', shortName: 'BA'},
  {name: 'Ceará', shortName: 'CE'},
  {name: 'Distrito Federal', shortName: 'DF'},
  {name: 'Espírito Santo', shortName: 'ES'},
  {name: 'Goiás', shortName: 'GO'},
  {name: 'Maranhão', shortName: 'MA'},
  {name: 'Mato Grosso', shortName: 'MT'},
  {name: 'Mato Grosso do Sul', shortName: 'MS'},
  {name: 'Minas Gerais', shortName: 'MG'},
  {name: 'Pará', shortName: 'PA'},
  {name: 'Paraíba', shortName: 'PB'},
  {name: 'Paraná', shortName: 'PR'},
  {name: 'Pernambuco', shortName: 'PE'},
  {name: 'Piauí', shortName: 'PI'},
  {name: 'Rio de Janeiro', shortName: 'RJ'},
  {name: 'Rio Grande do Norte', shortName: 'RN'},
  {name: 'Rio Grande do Sul', shortName: 'RS'},
  {name: 'Rondônia', shortName: 'RO'},
  {name: 'Roraima', shortName: 'RR'},
  {name: 'Santa Catarina', shortName: 'SC'},
  {name: 'São Paulo', shortName: 'SP'},
  {name: 'Sergipe', shortName: 'SE'},
  {name: 'Tocantins', shortName: 'TO'}
]

export enum OrderStatusEnum {
  scheduled = 'Agendado',
  confirmed = 'Confirmado',
  inRoute = 'Em rota',
  delivered = 'Entregue',
  canceled = 'Cancelado',
  rejected = 'Frustrado'
}

export const OrderStatusColor = {
  scheduled: {main: 'gray', light: 'disabled'},
  confirmed: {main: 'warn.main', light: 'warn.light'},
  inRoute: {main: 'warn.main', light: 'warn.light'},
  delivered: {main: 'success.main', light: 'success.light'},
  canceled: {main: 'danger.main', light: 'danger.light'},
  rejected: {main: 'danger.main', light: 'danger.light'}
}
