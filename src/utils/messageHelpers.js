// utils/messageHelpers.js
export const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'No time'
    try {
        return new Date(timestamp).toLocaleTimeString()
    } catch (error) {
        console.error('Error formatting time:', error)
        return 'Invalid time'
    }
}

export const sortMessagesByTimestamp = (a, b) =>
    new Date(b.MessageBody.timestamp) - new Date(a.MessageBody.timestamp)
