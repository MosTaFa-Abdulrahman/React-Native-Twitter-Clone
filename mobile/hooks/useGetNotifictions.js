import { useEffect, useState } from "react";
import { makeRequest } from "../requestMethod";

function useGetNotifictions() {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    setIsLoading(true);

    try {
      const res = await makeRequest.get("notifiction/get");
      if (!res.data) console.log("Failed Get Notifictions 😥");
      setNotifications(res.data);
    } catch (error) {
      console.log(`Error Get Notifictions ${error.message} 😥`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return { isLoading, notifications, fetchNotifications };
}

export default useGetNotifictions;
