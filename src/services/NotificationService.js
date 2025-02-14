import axios from 'axios';

const API_BASE_URL = 'https://74rk0lon11.execute-api.us-east-1.amazonaws.com/non-prod'; // Replace with your backend URL

const NotificationService = {
	 // Send notification through backend
	 async sendNotification(message) {
		  const response = await axios.post(`${API_BASE_URL}/storeMessages`, {message});
		  return response.data;
	 },
	 
	 // Fetch list of notifications (optional if backed by the backend storage)
	 async getNotifications() {
      try{
        this.notifications = await axios.get(`${API_BASE_URL}/fetchMessages`);
        return this.notifications.data?.data
      }catch(error){
        console.error("Failed to fetch notifications:", error);
      }
	 },
};

export default NotificationService;