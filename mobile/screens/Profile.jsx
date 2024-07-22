import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Posts from "../components/Posts";
import { useAuthContext } from "../context/AuthContext";
import { makeRequest } from "../requestMethod";
import useFollowUnFollow from "../hooks/useFollowUnFollow";

export default function Profile({ route }) {
  const { authUser } = useAuthContext();
  const { username } = route.params;
  const [user, setUser] = useState({});
  const [feedType, setFeedType] = useState("posts");

  // Get User Profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await makeRequest.get(`/user/get/${username}`);
        setUser(res.data);
      } catch (error) {
        // console.error("Error fetching user profile:", error);
        // alert("Error fetching user profile 😥");
      }
    };

    fetchUserProfile();
  }, [username]);

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#bbb" }}>
        <Text style={{ fontSize: 20, Color: "red" }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // isMyProfile && Follow
  const isMyProfile = user.username === authUser.username;

  // Handle Follow/unFollow
  const { isFollowing, isLoading, handleFollowUnFollow } =
    useFollowUnFollow(user);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Image
        source={{
          uri:
            user.coverPic ||
            "https://plus.unsplash.com/premium_photo-1673306778968-5aab577a7365?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFja2dyb3VuZCUyMGltYWdlfGVufDB8fDB8fHww",
        }}
        style={styles.backgroundImage}
      />

      <View style={styles.userHeader}>
        <Image
          source={{
            uri:
              user.profilePic ||
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmxvbmUlMjBnaXJsfGVufDB8fDB8fHww",
          }}
          style={styles.userImg}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#F7F9F9",
              padding: 10,
              borderRadius: 50,
            }}
          >
            <Ionicons name="mail-outline" size={20} color="blue" />
          </TouchableOpacity>
          {!isMyProfile ? (
            <TouchableOpacity
              style={styles.followBtn}
              onPress={handleFollowUnFollow}
              disabled={isLoading}
            >
              <Text style={styles.followText}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.userInfo}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>{user.name}</Text>
        <Text style={{ color: "gray" }}>@{user.username}</Text>
        <Text style={{ marginTop: 5, color: "#424949" }}>
          {user.bio || "No bio available"}
        </Text>

        <View style={styles.follows}>
          <View style={{ flexDirection: "row", marginRight: 15 }}>
            <Text style={{ fontWeight: "bold", fontSize: 15, marginRight: 5 }}>
              {user.followers?.length || 0}
            </Text>
            <Text style={styles.handFollow}>Followers</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold", fontSize: 15, marginRight: 3 }}>
              {user.following?.length || 0}
            </Text>
            <Text style={styles.handFollow}>Followings</Text>
          </View>
        </View>

        <View style={styles.container}>
          <TouchableOpacity onPress={() => setFeedType("posts")}>
            <Text style={styles.headerText}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFeedType("likes")}>
            <Text style={styles.headerText}>Likes</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Posts feedType={feedType} username={username} userId={user._id} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: "100%",
    height: "20%",
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  userImg: {
    width: 70,
    height: 70,
    borderRadius: 50,
    top: -25,
  },
  followBtn: {
    backgroundColor: "black",
    color: "white",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  followText: {
    fontWeight: "bold",
    color: "#EBF5FB",
  },
  editBtn: {
    backgroundColor: "#5FB8F3",
    color: "white",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  editText: {
    fontWeight: "bold",
    color: "#EBF5FB",
  },
  userInfo: {
    paddingHorizontal: 20,
  },
  follows: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  handFollow: { color: "#979A9A", fontWeight: "bold" },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#5DADE2",
    paddingHorizontal: 10,
  },
});
