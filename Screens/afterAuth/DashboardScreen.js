import React from "react";
import { Text, View } from "react-native";

const DashboardScreen = (props) => {
  console.log("Screen Loaded");
  return (
    <View>
      <Text style={{color:"black", padding:25}} >DashboardScreen</Text>
    </View>
  );
};

export default DashboardScreen;
