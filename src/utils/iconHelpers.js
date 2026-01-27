export function getNotificationIcon(unreadCount) {
  return unreadCount > 0 ? "notifications_unread" : "notifications"
}

export function getIconColor(unreadCount) {
  return unreadCount > 0 ? "error" : "default"
}
