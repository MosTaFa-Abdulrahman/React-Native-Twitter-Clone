import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import useLogin from "../hooks/useLogin";

export default function Login({ navigation }) {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const { login, loading } = useLogin();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image
        source={{
          uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAYFBMVEX///8dofIAnPIVn/IAmvH6/f/1+/4AmPHk8/3x+v7u+P4zqfPB4/skpfPq9v6+4fvd8P3V7PyX0PjL5/yz3PphuPVZtfWCxvdKsPRsvfaf0/mMzPiq1/l1wvdBrfSr2vnZRsKTAAAIVElEQVR4nO2d6bKrKhBGA61GgzjPU97/La8k2ZkTAVvNucX6c+rsKoNfGpqmachuZzAYDAaDwWAwGAwGg8FgMPxPcII49cMRP40jz976dWbg+l1ZF4zxEcaqvG8bP/gnBQVhmzNCKQCQkfEfSilheZm5W7+aKlFSMHKW8cCoiRdtPPl87K/wknJE5ajkRcgN1n+X47XsV8Q4CaffpIz2oaT2Pj/fMav6kaHlM+u7lJMci2fvHw+O1Ti4GoUGo8UGYVBKSDlB+9eXcKKEjVYF/tlury3W9TJq7LSS1TL2tSJ96EyO65fcEj3UShTaDLlVKmiXxskGWSkn2wzHqxo78pOcnMca8EC+zUM/PqTSKyXxGqaiZVTDGuf0YJwlObt6cqURk/KxW5Ijthan/eqP3wE8CaIs6St+NyfRQsEwTkvF55AP7kQXO1HWItTkFScPnhyIyhzjDpeeGaKKOWpoOb3H02M0cRRaDenft4KpJtXU8izNUnK0dkv/HkRUEzD69SWlxRSRSrNecW0WPk3D6uRIWqrpIPSe6K4/AMtwgqAOpY8RGO4Hvzc9eELr/mneqQy3T7gMRwu79Xvb9ZtpKyX7h+d5M1+NXaIYhhZXLYe4q7mEW3vq3UDaw1wxqeLM/0FLfrHEIe36Cmgp8V7PDQPUCjPuO5zyzZpSkXGJUwqf7ERhUg9jQCDn1vjr5+RqLuSZVCm8/CCmCD0vPrZ1dV5ug9Ra03u3Mh9mTTjJfMOQoS/zgfFTluD0B6lgM3jXMpBE30VHBcocc7LH9T9yK5q3YsauVivNvPeELx13NrSUa/q9GDH3+no+egzCcWbMG1Yu2fbhkxhKWq21dJQjaxnX07LLYJt/ahuswtcYOenHD9TUohJrfmmbskR55Ngdbi9TmyiqL74HIO8U4wGnxYmXr29Qq0x6vfX1w3ifKvW1oMcVo+ZVm69ixNxbqnyeizPLXHiXGfyGPyFmnLlYK++lXYRY5toybRXTee609wGLNLJ9LcZ0ZsoLX0dmhQt71rhSepASGSOUq8e7diPXyemQRBK9zcfSAoXOnC37XQJlZTppHjQxVGt/KZCOP8SmUBd/H5MpQvx/FqO1DFGasympyiz6Yh60MaMnZhcrLdlPW6rhx/4co4nRy+F5pVo4NXYkVvTd+6k0Qklm6IvZ+covILa8hzpJXwM3t9hYjKpprpIIy5Mnh3DAis10xeziSvfrBGtPeZ740eHiFJwWyTKgnVTpZqzbAeh+T8UwapsuTBMcLbreTHyf/czvE8ZJyLIsUQ+DA9BUV8yMjvb8EjgfM9p7RiYyQ3oJNPiM0gQ7mVrXrAuwORlv5/v6eW2g0tiMuBnz8FNqINeoGWnqq9c4lKi5iHlYvUZCtdmTqxwPP7OqDVXIO1zJ9oTuWRs7pxn8iLMZiQBIZx0exYj5blymdKl7cPxiaxUXtEKz+LI/K+pah6Iue/wNCT10AoDDXRWAqM79lVHDtAIArMUULnq5mV39Q/74BtXb8u5+aaq8ouWZd7v0Ny2jV8RzQMx0owFcbzVj/1IQ8wetNDe7w18U02suAFysRSYiWsGMwEl+zzT6BZY4FVWYqFYz3uH9nAsA3SGz00nPLs2MYn4PpwwRjcc6U1XQsmY4QD7rBEyz9fs/IlmR9QH7p2JnNrPyHbewYh5Qzax4/aXJBub1MkGGtU08G4zzFc2PqNFKzD5jN2j7EbOAdr4WcVSV/4AXADKvRPwPOxy2V0NlS2UnSavN82YW4vGqErY1DnDMM9l+Rba0zl7l6O80XjfK2UoLkLmz/zNuU0wd4V8KiuKXn+R0fUU2SKKDRimjBE7ctfnq8ZpVYpzfO+MFt8+y3bBdO9mpm8h8S1rkfdsmSdKWfV4Mq+8JUsxrCaLquiUA4nzUv2yY80EeANgmfgZUw2y8RIMB0zCirmHL0KxFvl0m3M40iqflJfDKrbQQ0iFrwTn+qoVW5c8UWDWWqlpQ3fIfB6RLFhRZIsLcIR/nkQUYQkrmHeF+fTUW8q03N9r9dOvIWuqltKxfggLDQp1M4PXraiG4lxE9cShXjJiB6BXKyKtpV/Np8y/tmMTr1goFoFhk3f+AndarLGtmXtghi5uQFWrRuG5liSJOnFsLO2kAxHzMlJysWFYO5KtpGbH9nFC6lKOms85i6OA2OX93Cy6ClmUSmFN6jmUhLujhqCXc22gReFGaZUmOqWVu8cI8ggQxyYl4aZ8G4zSK6AiAdRveW4wb4GyrJe0xQ0/gG2o5lKhbApSjX3UrT4Zb7kCRr4ZVwPblr5CW06JfHDsTz8+RSwMWyV1KYAfjqgb5WixebjL0nehYY9cG0WELNyY2aPGrG6AIV9diR2Gbc7TD/VcpZOK3GfBx4q4sGPJQEVDWLJjse+WQdmU+cLLAHi1Yldq9b/LYURrdShhsL4j8Y1sX7PWScSSolSznkZ0jA/GbNkVejcuu0RbW6cdhFlofj2bB3rF85NByKk7Nnrf+lxFxkQJsgR9ReCJFn0Y+SFG6VlAXJysWL5QDpnjhoz5uly8qh/I6WzEUO8lZZsiI292ylTNjblYvIQeEVTb4razALxlyHpbSoU3XzldecKJusNCS/mBZVeeumUZ+0ePXBMM8QPe8jLf//SsvrPmsCkAxAfM83NIm97jHWi9AOwUSZFjdfU3gZrfIWUYUnHWwIS9/TMkZJ85EDM2nwraTDEr4UPRJJnOd61aIvH9S1pUw0ukSFziF1X/Q09+4uKymydJNXZcsjhunYdaNovKiGBcLbFw2CIYi78u2ycI0crfJHOnjeIEbRVEcx2maxoLIDTxne/9rMBgMBoPBYDAYDAaDwWDYhP8A89eKDhPka1gAAAAASUVORK5CYII=",
        }}
        style={styles.logo}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={inputs.username}
        onChangeText={(e) => setInputs({ ...inputs, username: e })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={inputs.password}
        onChangeText={(e) => setInputs({ ...inputs, password: e })}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => login(inputs)}
        isLoading={loading}
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signup}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f5f8fa",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1DA1F2",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  footerText: {
    fontSize: 14,
    color: "#aaa",
  },
  signup: {
    fontSize: 14,
    color: "#1DA1F2",
    marginLeft: 5,
  },
});
