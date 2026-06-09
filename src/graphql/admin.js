import { gql } from '@apollo/client'

export const GET_ADMIN_DASHBOARD = gql`
  query GetAdminDashboard {
    users {
      id
      name
      email
      role
    }
    agents {
      id
      name
      email
      phone
      photo
    }
    properties {
      id
      title
      description
      price
      currency
      type
      status
      bedrooms
      bathrooms
      area
      features
      images
      location {
        country
        province
        city
        address
        coordinates {
          lat
          lng
        }
      }
      agent {
        id
        name
        email
        phone
        photo
      }
    }
    inquiries {
      id
      name
      email
      message
      property {
        id
        title
      }
      user {
        id
        name
        email
      }
      createdAt
    }
  }
`

export const CREATE_AGENT = gql`
  mutation CreateAgent($input: AgentInput!) {
    createAgent(input: $input) {
      id
      name
      email
      phone
      photo
    }
  }
`

export const UPDATE_AGENT = gql`
  mutation UpdateAgent($id: ID!, $input: AgentInput!) {
    updateAgent(id: $id, input: $input) {
      id
      name
      email
      phone
      photo
    }
  }
`

export const DELETE_AGENT = gql`
  mutation DeleteAgent($id: ID!) {
    deleteAgent(id: $id)
  }
`

export const CREATE_PROPERTY = gql`
  mutation CreateProperty($input: PropertyInput!) {
    createProperty(input: $input) {
      id
      title
      price
      currency
      type
      status
    }
  }
`

export const UPDATE_PROPERTY = gql`
  mutation UpdateProperty($id: ID!, $input: UpdatePropertyInput!) {
    updateProperty(id: $id, input: $input) {
      id
      title
      price
      currency
      type
      status
    }
  }
`

export const DELETE_PROPERTY = gql`
  mutation DeleteProperty($id: ID!) {
    deleteProperty(id: $id)
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

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: ID!, $role: String!) {
    updateUserRole(userId: $userId, role: $role) {
      id
      role
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`

export const DELETE_INQUIRY = gql`
  mutation DeleteInquiry($id: ID!) {
    deleteInquiry(id: $id)
  }
`
