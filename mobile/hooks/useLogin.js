import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../requestMethod";

function useLogin() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useContext(AuthContext);

  const login = async (inputs) => {
    if (!inputs.username || !inputs.password) {
      return alert("Please fill all the fields 😍");
    }

    setLoading(true);

    try {
      const { data } = await makeRequest.post("auth/login", inputs);
      setAuthUser(data);
    } catch (error) {
      alert(`${error.message} 😥`);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}

export default useLogin;
