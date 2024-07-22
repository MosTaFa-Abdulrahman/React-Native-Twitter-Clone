import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../requestMethod";

function useLogout() {
  const { setAuthUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await makeRequest.post("auth/logout");
      setAuthUser(null);
    } catch (error) {
      alert(`${error.message} 😥`);
    }
  };

  return { handleLogout };
}

export default useLogout;
