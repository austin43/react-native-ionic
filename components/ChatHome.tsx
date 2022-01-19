import { useNavigation } from "@react-navigation/native";
import { Button, View } from "react-native";

export const ChatHome: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Button
        title="sup"
        onPress={() => {
          navigation.navigate("ChatDetail");
        }}
      />
    </View>
  );
};
