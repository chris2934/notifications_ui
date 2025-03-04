// graphql/queries.js
export const GET_MESSAGES = `
  query GetMessages {
    getMessages {
      MessageId
      ReceivedAt
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

export const SEND_MESSAGE_MUTATION = `
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      MessageId
      ReceivedAt
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

export const MESSAGE_SUBSCRIPTION = `
  subscription OnNewMessage {
    onNewMessage {
      MessageId
      ReceivedAt
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
