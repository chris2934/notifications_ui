import axios from 'axios';

const API_BASE_URL = 'https://your-backend-api.com/api'; // Replace with your backend URL

export default {
  // Send notification through backend
  async sendNotification(message) {
    const response = await axios.post(`${API_BASE_URL}/notifications`, { message });
    return response.data;
  },

  // Fetch list of notifications (optional if backed by the backend storage)
  async getNotifications() {
    const response = await axios.get(`${API_BASE_URL}/notifications`);
    return response.data;
  },
};