import client from '../graphql/client'
import { LOGIN, REGISTER } from '../graphql/mutations'

export async function login(email, password) {
  const { data } = await client.mutate({ mutation: LOGIN, variables: { input: { email, password } } })
  return data.login
}

export async function register(name, email, password) {
  const { data } = await client.mutate({ mutation: REGISTER, variables: { input: { name, email, password } } })
  return data.register
}
