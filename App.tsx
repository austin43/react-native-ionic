import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View, Appearance } from "react-native";
import {
  createClient,
  dedupExchange,
  fetchExchange,
  Provider,
  useQuery,
} from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { simplePagination } from "@urql/exchange-graphcache/extras";
import { useEffect, useState } from "react";
import { Chat } from "./components/Chat";
import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./components/Home";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import "react-native-get-random-values";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { theme } from "./subscribers/theme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ProfileHome } from "./components/ProfileHome";
import { ChatHome } from "./components/ChatHome";
import { Ionicons } from "@expo/vector-icons";
import { ChatDetail } from "./components/ChatDetail";

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

const client = createClient({
  url: "https://api.spacex.land/graphql/",
  exchanges: [
    dedupExchange,
    cacheExchange<any>({
      optimistic: {
        insertMessage: {
          content: "sup",
        },
      },
      updates: {
        Mutation: {
          insertMessage: () => {
            console.log("inserting");
          },
        },
      },
      resolvers: {
        Query: {
          launchesPast: (parent: any, args: any, cache: any, info: any) => {
            const paginationResult = simplePagination({
              offsetArgument: "offset",
              limitArgument: "limit",
            })(parent, args, cache, info);
            if (!!paginationResult?.length) {
              return [...paginationResult];
            } else {
              return parent.paginationResult;
            }
          },
        },
      },
    }),
    fetchExchange,
  ],
});

const limit = 10;

const HomeStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileHome} />
    </ProfileStack.Navigator>
  );
};

const ChatStackScreen = () => {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen name="ChatHome" component={ChatHome} />
      <ChatStack.Screen name="ChatDetail" component={ChatDetail} />
    </ChatStack.Navigator>
  );
};

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={Home} />
    </HomeStack.Navigator>
  );
};

export default function App() {
  useEffect(() => {
    theme();
  }, []);
  const scheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Provider value={client}>
          <NavigationContainer
            theme={scheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName:
                    | "home"
                    | "home-outline"
                    | "chatbubble"
                    | "chatbubble-outline"
                    | "person-circle"
                    | "person-circle-outline" = "home-outline";

                  if (route.name === "HomeScreen") {
                    iconName = focused ? "home" : "home-outline";
                  } else if (route.name === "ChatScreen") {
                    iconName = focused ? "chatbubble" : "chatbubble-outline";
                  } else if (route.name === "ProfileScreen") {
                    iconName = focused
                      ? "person-circle"
                      : "person-circle-outline";
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "tomato",
                tabBarInactiveTintColor: "gray",
              })}
              initialRouteName="HomeScreen"
            >
              <Tab.Screen name="HomeScreen" component={HomeStackScreen} />
              <Tab.Screen name="ChatScreen" component={ChatStackScreen} />
              <Tab.Screen name="ProfileScreen" component={ProfileStackScreen} />
            </Tab.Navigator>
            <StatusBar style="auto" />
          </NavigationContainer>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
