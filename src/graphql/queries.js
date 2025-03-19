// graphql/queries.js
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

export const MESSAGE_SUBSCRIPTION = `
  subscription onNewMessage {
    onNewMessage {
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
export const UPDATE_MESSAGE_READ_STATUS = `
  mutation UpdateMessage($input: UpdateMessageInput!) {
  updateMessage(input: $input) {
    MessageId
    ReceivedAt
    isRead
  }
}
`

