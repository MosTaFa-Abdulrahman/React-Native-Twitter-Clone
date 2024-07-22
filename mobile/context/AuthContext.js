import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userInfo");
        if (storedUser) {
          setAuthUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to fetch user info from AsyncStorage", error);
      }
    };

    fetchUserInfo();
  }, []);

  const saveUser = async (user) => {
    try {
      setAuthUser(user);
      if (user) {
        await AsyncStorage.setItem("userInfo", JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem("userInfo");
      }
    } catch (error) {
      console.error("Failed to save user info to AsyncStorage", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser: saveUser }}>
      {children}
    </AuthContext.Provider>
  );
};
