import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Keyboard,
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
import {
  createClient,
  dedupExchange,
  fetchExchange,
  useMutation,
  useQuery,
} from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { simplePagination } from "@urql/exchange-graphcache/extras";
import { useCallback, useEffect, useRef, useState } from "react";
import { collectTypesFromResponse } from "@urql/core/dist/types/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";
import { v4 } from "uuid";

const mutation = `
  mutation ($content: String!) {
    insertMessage(
      content: $content
    ) {
      __typename
      id
      content
    }
  }
`;

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

const limit = 10;

export const ChatDetail: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<FlatList>(null);
  const scrollPositionRef = useRef<number | null>(null);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const [sentMessages, setSentMessages] = useState<
    {
      id: string;
      details: string;
    }[]
  >([]);
  const [, insertMessage] = useMutation(mutation);

  const onEndReached = () => {
    setOffset(offset + limit);
  };

  const onViewableItemsChanged = useCallback(() => {
    ref.current?.scrollToOffset({
      animated: false,
      offset: scrollPositionRef.current || 0,
    });
  }, []);

  const onSendMessage = useCallback(async () => {
    // const { error } = await insertMessage(
    //   { content: "sup" },
    //   { requestPolicy: "cache-only" }
    // );
    setSentMessages([{ id: v4(), details: "test" }, ...sentMessages]);
    // console.log("sent", error);
  }, [sentMessages]);

  // const onViewableItemsChanged = useCallback(
  //   ({ viewableItems }: { viewableItems: ViewToken[] }) => {
  //     if (viewableItems[0]?.index && viewableItems[0].index > 3) {
  //       setShowScrollArrow(true);
  //     } else {
  //       setShowScrollArrow(false);
  //     }
  //     // console.log("on change", viewableItems[0].index);
  //   },
  //   []
  // );

  // console.log("offset", offset);

  const [{ data }] = useQuery({
    query,
    variables: {
      offset,
      limit,
    },
  });

  const receivedMessages = data?.launchesPast || [];
  const messages = [...sentMessages, ...receivedMessages];

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const onScrollBeginDrag = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  // useEffect(() => {
  //   console.log("data", data?.launchesPast);
  // }, [data?.launchesPast]);

  const renderItem = ({ item }: any) => {
    return <Text style={styles.text}>{item.details}</Text>;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={headerHeight}
    >
      <FlatList
        keyboardShouldPersistTaps="always"
        ref={ref}
        onEndReached={onEndReached}
        keyExtractor={(item) => item.id}
        inverted
        data={messages || []}
        renderItem={renderItem}
        onScrollBeginDrag={onScrollBeginDrag}
        maintainVisibleContentPosition={{
          autoscrollToTopThreshold: 300,
          minIndexForVisible: 0,
        }}
      />
      <View style={{ flexDirection: "row" }}>
        <TextInput
          placeholder="Type Your Message Here"
          style={styles.textInput}
          placeholderTextColor={"white"}
        />
        <TouchableOpacity
          onPress={onSendMessage}
          style={{
            // backgroundColor: "blue",
            width: 60,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="send" size={24} style={{ color: "white" }} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.scrollDownButton} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000",
  },
  text: {
    color: "white",
    borderRadius: 16,
    backgroundColor: "#1982FC",
    margin: 16,
    padding: 16,
  },
  textInput: {
    color: "white",
    borderColor: "#a1a1a1",
    borderBottomWidth: 1,
    backgroundColor: "#353535",
    padding: 16,
    flex: 1,
  },
  scrollDownButton: {
    position: "absolute",
    width: 50,
    height: 50,
    right: 0,
    bottom: 80,
    backgroundColor: "white",
    borderRadius: 100,
  },
});
