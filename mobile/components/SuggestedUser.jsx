import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import useFollowUnFollow from "../hooks/useFollowUnFollow";
import { useNavigation } from "@react-navigation/native";

export default function SuggestedUser({ user }) {
  const { isFollowing, isLoading, handleFollowUnFollow } =
    useFollowUnFollow(user);
  const navigation = useNavigation();

  return (
    <View style={styles.userContainer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Profile", { username: user.username })
        }
      >
        <Image source={{ uri: user?.profilePic }} style={styles.userImage} />
      </TouchableOpacity>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userUsername}>{user.username}</Text>
      </View>

      <TouchableOpacity
        style={[styles.followButton, isFollowing ? styles.unfollowButton : {}]}
        onPress={handleFollowUnFollow}
        disabled={isLoading}
      >
        <Text style={styles.followButtonText}>
          {isFollowing ? "Unfollow" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    color: "#333",
  },
  userUsername: {
    fontSize: 14,
    color: "#666",
  },
  followButton: {
    backgroundColor: "#3498DB",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  unfollowButton: {
    backgroundColor: "#E74C3C",
  },
  followButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
