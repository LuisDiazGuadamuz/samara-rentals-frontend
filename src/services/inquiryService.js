import client from '../graphql/client'
import { CREATE_INQUIRY } from '../graphql/mutations'

export async function createInquiry(input) {
  const { data } = await client.mutate({ mutation: CREATE_INQUIRY, variables: { input } })
  return data?.createInquiry
}
