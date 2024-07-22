import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { makeRequest } from "../requestMethod";

function useRegister() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useContext(AuthContext);

  const register = async (inputs) => {
    if (!inputs.username || !inputs.name || !inputs.email || !inputs.password) {
      return alert("Please fill all the fields 😍");
    }

    setLoading(true);

    try {
      const { data } = await makeRequest.post("auth/register", inputs);
      setAuthUser(data);
    } catch (error) {
      alert(`${error.message} 😥`);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
}

export default useRegister;
