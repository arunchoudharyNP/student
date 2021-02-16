import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";

import { StyleSheet, Text, View } from "react-native";

import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { enableScreens } from "react-native-screens";
import AppLoading from "expo-app-loading";

import RootNavigator from "./navigations/RootNavigator";

// import { createStore, combineReducers, applyMiddleware } from "redux";
// import ReduxThunk from "redux-thunk";

// import { RootNavigator } from "./Navigations/index";

enableScreens();


// export const reducer = combineReducers({
//   Auth:authReducer
// })

// const store = createStore(reducer,composeWithDevTools(applyMiddleware(ReduxThunk)));

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
    const imageAssets = cacheImages([]);

    const fontAssets = cacheFonts([
      { "open-sans": require("./assets/fonts/OpenSans-Regular.ttf") },
      { "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf") },
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
    <RootNavigator>
      <StatusBar style="transparent" />
    </RootNavigator>
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
