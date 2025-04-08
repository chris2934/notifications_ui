import { gql } from "@apollo/client"

export const GET_MESSAGES = `
  query GetMessages {
    getMessages {
      MessageId
      ReceivedAt
      isRead
      MessageBody {
        content
        metadata {
          type
          version
        }
        status
        timestamp
      }
    }
  }
`

export const MESSAGE_SUBSCRIPTION = gql`
  subscription onNewMessage {
    onNewMessage {
      MessageId
      ReceivedAt
      isRead
      recipientEmail
      MessageBody {
        content
        metadata {
          type
          version
        }
        status
        timestamp
      }
    }
  }
`
export const UPDATE_MESSAGE_READ_STATUS = gql`
  mutation UpdateMessage($input: UpdateMessageInput!) {
    updateMessage(input: $input) {
      MessageId
      ReceivedAt
      isRead
    }
  }
`
