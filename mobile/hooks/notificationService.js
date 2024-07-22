import { makeRequest } from "../requestMethod";

const notificationService = {
  getNotifications: async () => {
    try {
      const response = await makeRequest.get(`notifiction/get`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      const response = await makeRequest.delete(
        `notifiction/delete-notifiction/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  deleteAllNotifications: async () => {
    try {
      const response = await makeRequest.delete(
        `notifiction/delete-notifictions`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      throw error;
    }
  },
};

export default notificationService;
