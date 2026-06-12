const now = () => new Date().toISOString()

export const transformIncomingMessage = (msg) => {
  const timestamp = now()
  return {
    MessageId: msg.MessageId ?? msg.id,
    ReceivedAt: msg.ReceivedAt ?? timestamp,
    isRead: false,
    model: msg.model ?? "",
    MessageBody: {
      content: msg.MessageBody?.content ?? msg.content ?? "",
      metadata: msg.MessageBody?.metadata ?? {
        type: "NOTIFICATION",
        version: "1.0",
      },
      status: msg.MessageBody?.status ?? "RECEIVED",
      timestamp: msg.MessageBody?.timestamp ?? msg.ReceivedAt ?? timestamp,
    },
  }
}

// Validation utility
export const isValidMessage = (msg) => {
  return msg?.MessageId && msg?.ReceivedAt && msg?.MessageBody
}
