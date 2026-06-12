export const GET_MESSAGES = `
  query GetMessages {
    getMessages {
      MessageId
      ReceivedAt
      isRead
      recipientEmail
      model
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
      isRead
      recipientEmail
      model
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
      recipientEmail
      model
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
