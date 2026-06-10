import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`

export const ADD_FAVORITE = gql`
  mutation AddFavorite($propertyId: ID!) {
    addFavorite(propertyId: $propertyId) {
      id
      property {
        id
        title
      }
    }
  }
`

export const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($propertyId: ID!) {
    removeFavorite(propertyId: $propertyId)
  }
`

export const CREATE_INQUIRY = gql`
  mutation CreateInquiry($input: InquiryInput!) {
    createInquiry(input: $input) {
      id
      name
      email
      message
    }
  }
`

export const CREATE_PROPERTY = gql`
  mutation CreateProperty($input: PropertyInput!) {
    createProperty(input: $input) {
      id
      title
      price
      status
    }
  }
`

export const UPDATE_PROPERTY_STATUS = gql`
  mutation UpdatePropertyStatus($id: ID!, $status: String!) {
    updatePropertyStatus(id: $id, status: $status) {
      id
      status
    }
  }
`

export const DELETE_PROPERTY = gql`
  mutation DeleteProperty($id: ID!) {
    deleteProperty(id: $id) {
      id
    }
  }
`

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: ID!, $role: String!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      role
    }
  }
`

export const DELETE_INQUIRY = gql`
  mutation DeleteInquiry($id: ID!) {
    deleteInquiry(id: $id) {
      id
    }
  }
`
