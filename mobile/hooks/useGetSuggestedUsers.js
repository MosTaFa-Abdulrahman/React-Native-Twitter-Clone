import { useEffect, useState } from "react";
import { makeRequest } from "../requestMethod";

function useGetSuggestedUsers() {
  const [loading, setLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const getSuggestedUsers = async () => {
    setLoading(true);
    setSuggestedUsers([]);

    try {
      const res = await makeRequest.get("/user/suggested/get");
      if (res.data) {
        setSuggestedUsers(res.data);
      } else return alert(`Error Get Suggested Users Not Found 😥`);
    } catch (error) {
      alert(`Error: ${error.message} 😥`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSuggestedUsers();
  }, []);

  return { loading, suggestedUsers, getSuggestedUsers };
}

export default useGetSuggestedUsers;
