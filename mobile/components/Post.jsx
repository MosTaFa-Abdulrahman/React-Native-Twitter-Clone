import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { makeRequest } from "../requestMethod";
import { AuthContext } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { deletePost } from "../store/postSlice";
import { useNavigation } from "@react-navigation/native";
import useLikeDisLikePost from "../hooks/useLikeDisLikePost";

export default function Post({
  post,
  postId,
  postedBy,
  text,
  img,
  likes,
  replies,
  onDeletePost,
}) {
  const { authUser: currentUser } = useContext(AuthContext);
  const [postComments, setPostComments] = useState(
    Array.isArray(replies) ? replies : []
  );
  const [user, setUser] = useState({});
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Handle Like/disLike
  const { handleLikeAndUnlike, liked } = useLikeDisLikePost(post);

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Get Single User
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await makeRequest.get(`/user/get/${postedBy}`);
        if (data) setUser(data);
        else return alert("User Not Found 😥");
      } catch (error) {
        console.log("Error Get User 😥", error);
      }
    };
    getUser();
  }, [postedBy]);

  // Delete Post
  const handleDeletePost = async () => {
    try {
      const res = await makeRequest.delete(`post/delete/${postId}`);
      if (!res.data) return alert("Error Delete Post 😥");
      dispatch(deletePost(postId));
      // alert("Post Deleted Successfully 🥰");
      onDeletePost();
    } catch (error) {
      alert(`${error.message} 😥`);
    }
  };

  // Add Comment
  const handleAddComment = async () => {
    try {
      if (!newComment) return alert("Please Add Your Comment 🤗");
      const res = await makeRequest.put(`post/reply/${postId}`, {
        text: newComment,
        userId: currentUser._id,
      });
      console.log("Add Comment Response:", res.data);
      if (!res.data) return alert("Error Add Comment 😥");
      setPostComments((prevComments) => [...prevComments, res.data]);
      setNewComment("");
    } catch (error) {
      alert(`${error.message} 😥`);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await makeRequest.delete(
        `post/${postId}/replies/${commentId}`,
        { userId: user._id }
      );
      if (!res.data) return alert("Error Delete Comment 😥");
      setPostComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      alert(`${error.message} 😥`);
    }
  };

  return (
    <View style={styles.post}>
      <View style={styles.postHeaderContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Profile", { username: user.username })
          }
        >
          <Image
            source={{
              uri: user?.profilePic,
            }}
            style={styles.userImg}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text style={{ marginRight: 3 }}>{user.name}</Text>
          <Text style={{ color: "gray", marginRight: 3 }}>
            {user.username} . {formatDistanceToNow(new Date(post.createdAt))}
          </Text>
        </View>
        {currentUser._id === user._id && (
          <TouchableOpacity onPress={handleDeletePost}>
            <FontAwesome name="trash-o" size={20} color="tomato" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.postText}>{text}</Text>
      <Image
        source={{
          uri: img
            ? img
            : "https://images.unsplash.com/photo-1579158949482-3e9e0ac69333?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZGVmYXVsdCUyMGltYWdlfGVufDB8fDB8fHww",
        }}
        style={styles.postImage}
      />

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLikeAndUnlike}
        >
          <FontAwesome
            name={liked ? "heart" : "heart-o"}
            size={24}
            color={liked ? "red" : "black"}
          />
          <Text style={styles.actionText}>{likes?.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowComments(!showComments)}
        >
          <FontAwesome name="comment-o" size={24} color="black" />
          <Text style={styles.actionText}>{postComments.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="share-square-o" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {showComments && (
        <View style={styles.commentsContainer}>
          {postComments?.map((comment, i) => (
            <View key={i} style={styles.commentItem}>
              <TouchableOpacity>
                <Image
                  source={{
                    uri:
                      comment?.userProfilePic ||
                      "https://plus.unsplash.com/premium_photo-1682089877310-b2308b0dc719?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHVzZXIlMjBwcm9maWxlJTIwcGljdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
                  }}
                  style={styles.commentUserImg}
                />
              </TouchableOpacity>
              <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>{comment?.username}</Text>
                <Text style={{ color: "#626567" }}>{comment.text}</Text>
              </View>
              {currentUser._id === comment.userId._id && (
                <TouchableOpacity
                  onPress={() => handleDeleteComment(comment._id)}
                >
                  <FontAwesome name="trash-o" size={20} color="tomato" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={(text) => setNewComment(text)}
            />
            <TouchableOpacity
              style={styles.addCommentButton}
              onPress={handleAddComment}
            >
              <Text style={{ color: "white" }}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  post: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  postHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    paddingHorizontal: 10,
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postText: {
    marginBottom: 10,
    marginLeft: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    resizeMode: "cover",
    borderRadius: 10,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 3,
  },
  commentsContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  commentUserImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
    color: "red",
    marginRight: 5,
    borderRadius: 10,
  },
  commentUsername: {
    color: "#2980B9",
    fontWeight: "bold",
    marginBottom: 5,
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addCommentButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#2874A6",
  },
});
