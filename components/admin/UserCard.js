import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

const UserCard = (props) => {
  const { data } = props;
  const [viewCodes, setviewCodes] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(null);

  const renderCode = (code) => {
    return (
      <View style={styles.codeContainer}>
        <Text style={styles.codeText}>{code}</Text>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.container}
        onPress={() => {
          setcurrentIndex((currentIndex) =>
            currentIndex == null ? index : null
          );
        }}
      >
        <View style={styles.userTitle}>
          <Text style={styles.textStyleTitle}>{item.title}</Text>
          <Text style={styles.textStyleCount}> Count: {item.count} </Text>
        </View>
        {index == currentIndex && (
          <View>
            <FlatList
              data={item.userOTP}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                return <View>{renderCode(item)}</View>;
              }}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.title}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: "100%",

    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },
  textStyleTitle: {
    fontSize: 30,
    lineHeight: 70,
    textTransform: "uppercase",
  },
  textStyleCount: {
    fontSize: 30,
    lineHeight: 70,
  },
  userTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    textTransform: "uppercase",
  },
  codeText: {
    fontSize: 25,
  },
  codeContainer: {
    height: 40,
    width: "100%",
    marginLeft: 40,
    borderBottomWidth: 1,
    color: 1,
  },
});

export default UserCard;
