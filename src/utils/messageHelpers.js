export const sortMessagesByTimestamp = (messages) => {
  if (!Array.isArray(messages)) {
    return []
  }
  return messages.sort(
    (a, b) =>
      new Date(b.MessageBody.timestamp) - new Date(a.MessageBody.timestamp),
  )
}

export const calculateUnreadCount = (messages) => 
  messages.filter(m => !m.isRead).length
