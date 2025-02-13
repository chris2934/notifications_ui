import axios from 'axios';

const API_BASE_URL = 'https://74rk0lon11.execute-api.us-east-1.amazonaws.com/non-prod'; // Replace with your backend URL

export default {
  // Send notification through backend
  async sendNotification(message) {
    const response = await axios.post(`${API_BASE_URL}/trigger-notifications`, { message });
    return response.data;
  },

  // Fetch list of notifications (optional if backed by the backend storage)
  async getNotifications() {
    const response = await axios.get(`${API_BASE_URL}/Notifications`);
    return response.data;
  },
};