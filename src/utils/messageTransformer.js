const now = () => new Date().toISOString()

export const transformIncomingMessage = (msg) => {
  const timestamp = now()
  return {
    MessageId: msg.MessageId ?? msg.id,
    ReceivedAt: msg.ReceivedAt ?? timestamp,
    isRead: false,
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

export const transformMessage = (msg) => ({
  MessageId: msg.MessageId,
  ReceivedAt: msg.ReceivedAt,
  isRead: msg.isRead || false,
  MessageBody: {
    content: msg?.MessageBody?.content || "",
    metadata: {
      type: msg?.MessageBody?.metadata?.type || "NOTIFICATION",
      version: msg?.MessageBody?.metadata?.version || "1.0",
    },
    status: msg?.MessageBody?.status || "UNKNOWN",
    timestamp: msg?.MessageBody?.timestamp || msg?.ReceivedAt,
  },
})

// Validation utility
export const isValidMessage = (msg) => {
  return msg?.MessageId && msg?.ReceivedAt && msg?.MessageBody
}
