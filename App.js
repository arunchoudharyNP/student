import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";

import { StyleSheet, Image, SafeAreaView } from "react-native";

import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { enableScreens } from "react-native-screens";
import AppLoading from "expo-app-loading";

import AdminReducers from "./Store/Reducers/AdminReducers";
import UserAuthReducers from "./Store/Reducers/UserAuthReducers";
import CreateUsersOTP from "./Store/Reducers/CreateUsersOTP";
import ChatReducers from "./Store/Reducers/ChatReducers";
import { Provider as StoreProvider } from "react-redux";

import RootNavigator from "./navigations/RootNavigator";

import { createStore, combineReducers, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";


enableScreens();



export const reducer = combineReducers({
  AuthAdmin: AdminReducers,
  UsersOTP: CreateUsersOTP,
  UserAuthReducers: UserAuthReducers,
  ChatReducers: ChatReducers,
});

const store = createStore(reducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [loadState, setloadState] = useState(false);



  function cacheImages(images) {
    return images.map((image) => {
      if (typeof image === "string") {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  }

  function cacheFonts(fonts) {
    return fonts.map((font) => Font.loadAsync(font));
  }

  const handleResourcesAsync = async () => {
    const imageAssets = cacheImages([
      "https://media.giphy.com/media/e81G1AOXdQpmgYKLPq/giphy.gif",
      "https://media.giphy.com/media/ZFKaOsucd3qqcvrKMQ/giphy.gif",
      require("./assets/images/friendsLogo.png"),
      require("./assets/images/logo_circle.png"),
      require("./assets/images/logo_circleBlack.jpg"),
      require("./assets/images/logo_circleDot.png"),
    ]);

    const fontAssets = cacheFonts([
      { "open-sans": require("./assets/fonts/OpenSans-Regular.ttf") },
      { "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf") },
      { Caveat: require("./assets/fonts/Caveat-VariableFont_wght.ttf") },
    ]);

    return Promise.all([...imageAssets, ...fontAssets]);
  };



 

  if (!loadState) {
    return (
      <AppLoading
        startAsync={handleResourcesAsync}
        onError={(error) => console.warn(error)}
        onFinish={() => setloadState(true)}
      />
    );
  }

  return (
    <StoreProvider store={store}>
      <StatusBar style="inverted" />
      <RootNavigator></RootNavigator>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
