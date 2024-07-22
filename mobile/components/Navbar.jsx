import { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import useLogout from "../hooks/useLogout";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { makeRequest } from "../requestMethod";

export default function Navbar() {
  const { authUser: currentUser } = useContext(AuthContext);
  const { handleLogout } = useLogout();
  const navigation = useNavigation();

  // For Modal (Create Post)
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.cancelled) {
      console.log("Image picking cancelled");
      return;
    }

    if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
      setFile(result.assets[0].uri);
    } else {
      console.log("Image uri is null or undefined:", result);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", {
      uri: file,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    formData.append("text", text);
    formData.append("postedBy", currentUser._id); // Assuming you have the user's ID

    try {
      await axios.post("http://192.168.1.7:5000/api/post/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setModalVisible(false);
      setFile(null);
      setText("");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setSearching(true);
      try {
        const { data } = await makeRequest.get(`user/search?q=${query}`);
        setSearchResults(data);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <View style={styles.navBar}>
      <View style={styles.leftIcons}>
        <Feather name="twitter" size={30} color="#1DA1F2" />
      </View>

      <View style={styles.searchInput}>
        <TextInput
          placeholder="Search for User 🥰"
          style={styles.input}
          placeholderTextColor="#657786"
          value={searchQuery}
          onChangeText={(query) => handleSearch(query)}
        />
        {searching && <ActivityIndicator size="small" color="#1DA1F2" />}
        {searchResults.length > 0 && (
          <View style={styles.searchResults}>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.searchResultItem}
                  onPress={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    navigation.navigate("Profile", { username: item.username });
                  }}
                >
                  <Image
                    source={{ uri: item?.profilePic }}
                    style={styles.searchResultImage}
                  />
                  <Text style={styles.searchResultText}>{item.username}</Text>
                </TouchableOpacity>
              )}
              style={styles.flatList}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.rightIcons}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={24} color="#1DA1F2" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.rightIcons}
        onPress={() =>
          navigation.navigate("Profile", { username: currentUser.username })
        }
      >
        <Image
          source={{
            uri: currentUser?.profilePic,
          }}
          style={styles.userImg}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.rightIcons} onPress={handleLogout}>
        <Text style={{ fontSize: 13, marginLeft: 3, color: "tomato" }}>
          Logout
        </Text>
      </TouchableOpacity>

      {/* Show Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Create Post</Text>
            <TextInput
              style={styles.input}
              placeholder="Write Your Text Here 🥰"
              onChangeText={(text) => setText(text)}
              value={text}
            />
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.imagePicker}
            >
              <Text style={styles.imagePickerText}>Select Image</Text>
            </TouchableOpacity>

            {file && (
              <Image source={{ uri: file }} style={styles.selectedImage} />
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.postButton]}
                onPress={handleCreatePost}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.buttonText}>Post</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E8ED",
    zIndex: 1,
  },
  searchResults: {
    position: "absolute",
    top: 60,
    backgroundColor: "#FFFFFF",
    width: "100%",
    zIndex: 2,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#E1E8ED",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10,
  },
  flatList: {
    flexGrow: 0,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDEEFF",
  },
  searchResultImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  searchResultText: {
    fontSize: 16,
    color: "#14171A",
  },
  userImg: {
    width: 25,
    height: 25,
    borderRadius: 20,
    marginRight: 5,
    marginLeft: 5,
  },
  leftIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  input: {
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    color: "#14171A",
    borderWidth: 1,
    borderColor: "#DDEEFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchResults: {
    position: "absolute",
    top: 40,
    backgroundColor: "#FFF",
    width: "100%",
    zIndex: 1,
    maxHeight: 200,
  },
  rightIcons: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007BFF",
  },
  imagePicker: {
    backgroundColor: "#1DA1F2",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  imagePickerText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  selectedImage: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
    borderRadius: 5,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#DC3545",
  },
  postButton: {
    backgroundColor: "#1DA1F2",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
