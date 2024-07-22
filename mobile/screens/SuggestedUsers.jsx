import { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import useGetSuggestedUsers from "../hooks/useGetSuggestedUsers";
import SuggestedUser from "../components/SuggestedUser";

export default function SuggestedUsers() {
  const {
    loading,
    suggestedUsers: users,
    getSuggestedUsers,
  } = useGetSuggestedUsers();
  const [refreshing, setRefreshing] = useState(false);

  const renderUser = ({ item }) => <SuggestedUser user={item} />;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getSuggestedUsers();
    setRefreshing(false);
  }, [getSuggestedUsers]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggested Users</Text>

      {loading ? (
        <Text style={styles.title}>Loading...</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUser}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
});
