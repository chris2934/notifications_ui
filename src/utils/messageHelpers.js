export const sortMessagesByTimestamp = (messages) => {
  if (!Array.isArray(messages)) {
    return []
  }
  return messages.sort(
    (a, b) =>
      new Date(b.MessageBody.timestamp) - new Date(a.MessageBody.timestamp),
  )
}
