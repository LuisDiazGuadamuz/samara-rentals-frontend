import { gql } from '@apollo/client'

export const GET_PROPERTIES = gql`
  query GetProperties {
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
  }
`

export const GET_PROPERTY = gql`
  query GetProperty($id: ID!) {
    property(id: $id) {
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
  }
`

export const ME = gql`
  query Me {
    me {
      id
      name
      email
      role
    }
  }
`

export const GET_FAVORITES = gql`
  query GetFavorites {
    favorites {
      id
      property {
        id
        title
        price
        currency
        status
        type
        bedrooms
        bathrooms
        area
        images
        location {
          city
          province
        }
      }
    }
  }
`

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
    }
  }
`

export const GET_INQUIRIES = gql`
  query GetInquiries {
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

export const GET_AGENTS = gql`
  query GetAgents {
    agents {
      id
      name
      email
      phone
      photo
    }
  }
`
