import { Button, StyleSheet, View } from "react-native";
import { useCallback, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";

export const Login: React.FC = () => {
  const navigator = useNavigation();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "393853262953-87hl4cleja9hap3r67ipjukfj3n5f78c.apps.googleusercontent.com",
  });

  useEffect(() => {
    const fn = async () => {
      const auth = getAuth();
      console.log("response", response);
      if (response?.type === "success") {
        const { id_token } = response.params;
        const auth = getAuth();
        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
        navigator.navigate("Tabs");
      }
    };
    fn();
  }, [response]);

  return (
    <View style={styles.container}>
      <Button disabled={!request} title="sup" onPress={() => promptAsync()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    width: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 30,
    height: 30,
  },
});
