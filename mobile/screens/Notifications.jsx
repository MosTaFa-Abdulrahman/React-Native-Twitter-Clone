import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import notificationService from "../hooks/notificationService";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(
        notifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      await notificationService.deleteAllNotifications();
      setNotifications([]);
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Image source={{ uri: item.from.profilePic }} style={styles.userImage} />
      <View style={styles.notificationDetails}>
        <Text>
          {item.type === "follow"
            ? `${item.from.username} started following you.`
            : `${item.from.username} liked your post.`}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteNotification(item._id)}
        style={styles.deleteButton}
      >
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderNotificationItem}
        ListEmptyComponent={<Text>No notifications found.</Text>}
      />
      <TouchableOpacity
        onPress={handleDeleteAllNotifications}
        style={styles.deleteAllButton}
      >
        <Text style={{ color: "white", fontSize: 16 }}>
          Delete All Notifications
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  notificationDetails: {
    flex: 1,
  },
  deleteButton: {
    padding: 5,
  },
  deleteAllButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
    marginVertical: 10,
  },
});
