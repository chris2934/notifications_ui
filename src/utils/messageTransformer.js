export const transformIncomingMessage = (msg) => {
  const now = new Date().toISOString()
  return {
    MessageId: msg.MessageId ?? msg.id,
    ReceivedAt: msg.ReceivedAt ?? now,
    isRead: false,
    MessageBody: {
      content: msg.MessageBody?.content ?? msg.content ?? "",
      metadata: msg.MessageBody?.metadata ?? {
        type: "NOTIFICATION",
        version: "1.0",
      },
      status: msg.MessageBody?.status ?? "RECEIVED",
      timestamp: msg.MessageBody?.timestamp ?? msg.ReceivedAt ?? now,
    },
  }
}