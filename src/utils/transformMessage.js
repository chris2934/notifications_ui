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
