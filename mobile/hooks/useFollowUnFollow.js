import { useContext, useEffect, useState } from "react";
import { makeRequest } from "../requestMethod";
import { AuthContext } from "../context/AuthContext";

function useFollowUnFollow(user) {
  const { authUser: currentUser } = useContext(AuthContext);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(user?.followers?.includes(currentUser?._id));
  }, [user, currentUser?._id]);

  const handleFollowUnFollow = async () => {
    if (!currentUser) {
      return alert("Please login to follow this user 😍");
    }
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await makeRequest.post(`user/follow/${user._id}`);
      if (!res.data) {
        return alert(`You Can Not Follow this User 😥`);
      }

      if (isFollowing) {
        // UnFollow
        user?.followers?.pop();
      } else {
        // Follow
        user?.followers?.push(currentUser?._id);
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      alert(`Error: ${error.message} 😥`);
    } finally {
      setIsLoading(false);
    }
  };

  return { isFollowing, isLoading, handleFollowUnFollow };
}

export default useFollowUnFollow;
