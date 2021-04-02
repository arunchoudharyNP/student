import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Button } from "../helpingComponents";

const CardCom = (props) => {
  const { containerStyle, data, chatHandler, ...restProps } = props;

  const renderData = (item) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.container}
        onPress={() => chatHandler(item.ID, item.Name, item.Picture)}
      >
        <View style={{ flex: 2 }}>
          <Image source={{ uri: item.Picture }} style={styles.image} />
        </View>

        <View
          style={{
            flex: 8,
            flexDirection: "row",
            borderBottomColor: "#D9D9D9",
            borderBottomWidth: 1,
          }}
        >
          <View style={{ flex: 4 }}>
            <Text style={styles.textStyle}>{item.Name}</Text>
            <Text style={{ color: "grey" }}>Proffession Details </Text>
          </View>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Ionicons
              style={styles.chatStyle}
              name={"chatbox-outline"}
              color="grey"
              size={32}
            />
            <Text style={{ color: "black" }}>Chat</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.ID}
        renderItem={({ item }) => renderData(item)}
        refreshControl={
          <RefreshControl
            refreshing={props.refreshing}
            onRefresh={props.onRefresh}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 2,
    height: 70,
    width: "100%",
    paddingBottom: 5,
  },
  image: {
    resizeMode: "contain",
    height: 55,
    width: 55,
    padding: 5,
    borderRadius: 500,
  },
  textStyle: {
    color: "black",
    fontWeight: "700",
    fontSize: 22,
  },
  chatStyle: {
    alignItems: "flex-end",
  },
});

export default CardCom;
