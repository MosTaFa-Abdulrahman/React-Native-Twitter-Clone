import { useEffect } from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { makeRequest } from "../requestMethod";
import Post from "./Post";
import {
  deletePost,
  fetchPostsFailure,
  fetchPostsStart,
  fetchPostsSuccess,
} from "../store/postSlice";

// From (Home(feedType) + Profile(username, userId))
export default function Posts({ feedType, username, userId }) {
  const { posts, isLoading } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/post/all";
      case "followings":
        return "/post/feed";
      case "posts":
        return `/post/profile/${username}`;
      case "likes":
        return `/post/liked-posts/${userId}`;
      default:
        return "/post/all";
    }
  };
  const POST_ENDPOINT = getPostEndpoint();

  const fetchPosts = async () => {
    dispatch(fetchPostsStart());
    try {
      const res = await makeRequest.get(POST_ENDPOINT);
      if (!res.data) {
        throw new Error("Failed to fetch posts");
      }
      dispatch(fetchPostsSuccess(res.data));
    } catch (error) {
      dispatch(fetchPostsFailure(error.message));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [feedType, username]);

  const handleDeletePost = async (postId) => {
    try {
      await makeRequest.delete(`post/delete/${postId}`);
      dispatch(deletePost(postId));
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      {!isLoading && posts?.length === 0 && (
        <Text>Follow some users to see the feed</Text>
      )}

      {isLoading && <Text>Loading... </Text>}

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <Post
            post={item}
            postId={item._id}
            postedBy={item.postedBy._id}
            text={item.text}
            img={item.img}
            likes={item.likes}
            replies={item.replies}
            onDeletePost={() => handleDeletePost(item._id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
  },
});
