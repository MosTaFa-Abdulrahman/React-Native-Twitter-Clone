import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../requestMethod";
import {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  updatePostLikes,
} from "../store/postSlice";

function useLikeDisLikePost(post) {
  const [isLiking, setIsLiking] = useState(false);
  const { authUser: user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);
  const liked = post?.likes?.includes(user?._id);

  const handleLikeAndUnlike = async () => {
    if (!user) {
      return alert("You must be logged in to like a post 😎");
    }
    if (isLiking) return;
    setIsLiking(true);

    try {
      dispatch(fetchPostsStart());

      const res = await makeRequest.put(`post/like/${post._id}`);
      if (!res.data) {
        console.log("Error Liking Post 😥");
        setIsLiking(false);
        return;
      }

      dispatch(updatePostLikes({ postId: post._id, userId: user._id }));
      dispatch(fetchPostsSuccess(state.posts)); // Use state.posts to update correctly

      setIsLiking(false);
    } catch (error) {
      dispatch(fetchPostsFailure(error.message));
      setIsLiking(false);
    }
  };

  return { handleLikeAndUnlike, liked };
}

export default useLikeDisLikePost;
