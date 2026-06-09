import client from '../graphql/client'
import { GET_FAVORITES } from '../graphql/queries'
import { ADD_FAVORITE, REMOVE_FAVORITE } from '../graphql/mutations'

export async function getFavorites() {
  const { data } = await client.query({ query: GET_FAVORITES, fetchPolicy: 'network-only' })
  return data?.favorites ?? []
}

export async function addFavorite(propertyId) {
  const { data } = await client.mutate({
    mutation: ADD_FAVORITE,
    variables: { propertyId },
    refetchQueries: [{ query: GET_FAVORITES }],
    awaitRefetchQueries: false
  })
  return data?.addFavorite
}

export async function removeFavorite(propertyId) {
  const { data } = await client.mutate({
    mutation: REMOVE_FAVORITE,
    variables: { propertyId },
    refetchQueries: [{ query: GET_FAVORITES }],
    awaitRefetchQueries: false
  })
  return data?.removeFavorite
}
