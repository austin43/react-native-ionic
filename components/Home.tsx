import { StatusBar } from "expo-status-bar";
import {
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const query = `
  query ($limit: Int!, $offset: Int!) {
    launchesPast(
      limit: $limit
      offset: $offset
      order: "asc"
      sort: "mission_name"
    ) {
      __typename
      id
      mission_name
      launch_date_local
      details
    }
  }
`;

export const Home: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button
        title="sup"
        onPress={() => {
          navigation.navigate("ChatDetail");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    width: "100%",
    position: "relative",
  },
  button: {
    width: 30,
    height: 30,
  },
});
