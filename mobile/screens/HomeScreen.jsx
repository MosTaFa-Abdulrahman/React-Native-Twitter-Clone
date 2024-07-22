import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import Navbar from "../components/Navbar";
import Posts from "../components/Posts";

export default function HomeScreen() {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navbar />

      <View style={styles.container}>
        <TouchableOpacity onPress={() => setFeedType("forYou")}>
          <Text style={styles.headerText}>For you</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFeedType("followings")}>
          <Text style={styles.headerText}>Followings</Text>
        </TouchableOpacity>
      </View>

      <Posts feedType={feedType} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    // backgroundColor: "black",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#5DADE2",
    paddingHorizontal: 10,
  },
});
