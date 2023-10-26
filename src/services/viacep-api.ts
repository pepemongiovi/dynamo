import {requireEnv} from '@/server/utils'
import axios from 'axios'

export function getViacepURL(path = '') {
  // const viacepUrl = requireEnv('VIACEP_API_URL')
  const viacepUrl = 'https://viacep.com.br'
  return `${viacepUrl}${path}`
}

export async function findAddress(zipcode: string) {
  const requestUrl = getViacepURL(`/ws/${zipcode}/json`)
  const response = await axios.request({
    headers: {'Content-Type': 'application/json'},
    url: requestUrl,
    method: 'GET'
  })

  return response.data
}
