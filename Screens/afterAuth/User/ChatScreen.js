import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { ActivityIndicator, Text, View, Image, StyleSheet } from "react-native";
import {
  GiftedChat,
  InputToolbar,
  Send,
  Bubble,
} from "react-native-gifted-chat";
import { firestore } from "firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import * as ChatActions from "../../../Store/Actions/ChatActions";
import { useDispatch, useSelector } from "react-redux";
import init from "../../../components/Helper/db";
import CryptoJS, { AES } from "crypto-js";

const ChatScreen = (props) => {
  const { id, room, name, picture } = props.route.params;
  let messageFireStore = [];
  let storeMesseges = [];

  // const [currentMessageId, setcurrentMessageId] = useState("");

  const currentMessageId = useRef("Dummy");

  storeMesseges = useSelector((state) => state.ChatReducers.messages);

  console.log("storeMessages");
  console.log(storeMesseges);

  const dispatch = useDispatch();
  const [messages, setmessages] = useState([]);

  // const id = props.navigation.getParam("id");
  // const room = props.navigation.getParam("room");

  const db = firestore();
  const chatRef = db.collection("ServiceAccount").doc(id).collection(room);

  const headerLogo = () => {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Image style={styles.logoImage} source={{ uri: picture }} />
        <Text style={styles.logoTitle}>{name}</Text>
      </View>
    );
  };

  useEffect(() => {
    init(name)
      .then(() => {
        console.log("DB Initialized");
        dispatch(ChatActions.loadMessages(name));
      })
      .catch((err) => {
        console.log("DB initialization failed " + err);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = chatRef.onSnapshot((querySnapShot) => {
      messageFireStore = querySnapShot
        .docChanges()
        .filter(({ type }) => type == "added")
        .map(({ doc }) => {
          let message = doc.data();
          const text = AES.decrypt(message.text, message._id).toString(
            CryptoJS.enc.Utf8
          );
          message.text = text;
          return { ...message, createdAt: message.createdAt.toDate() };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      if (messageFireStore.length) {
        if (
          storeMesseges &&
          storeMesseges.findIndex(
            (data) =>
              data._id == messageFireStore[messageFireStore.length - 1]._id
          ) == -1
        ) {
          console.log("Called");

          messageFireStore.forEach((data) => {
            dispatch(ChatActions.addMessage(data, name));
          });

          // console.log(currentMessage);
          if (
            currentMessageId &&
            currentMessageId.current !==
              messageFireStore[messageFireStore.length - 1]._id
          ) {
            chatRef.get().then((data) => {
              data.forEach((doc) => {
                doc.ref.delete();
              });
            });

            console.log("delete");
          }

          // console.log(currentMessage);
        }
      }

      appendMessages(messageFireStore);
    });
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: "black",
        borderBottomWidth: 0.2,
        borderColor: "grey",
      },
      headerTintColor: "white",
      headerTitle: headerLogo(),
    });

    return () => unsubscribe();
  }, []);

  const appendMessages = (msg) => {
    setmessages((prevState) => GiftedChat.append(prevState, msg));
  };

  const onSend = async (msg) => {
    // console.log(msg[0]._id);
    // setcurrentMessageId(msg[0]._id);
    const writes = msg.map((m) => {
      // setcurrentMessageId(m._id);
      currentMessageId.current = m._id;
      const encryptText = AES.encrypt(m.text, m._id).toString();
      m.text = encryptText;
      // console.log(m);

      chatRef.add(m);
    });

    // const setMessage = dispatch(ChatActions.addMessage(msg[0], name));
    await Promise.all(writes);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <GiftedChat
        messages={
          storeMesseges &&
          storeMesseges.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          )
        }
        onSend={onSend}
        user={{
          _id: 1,
          name: room,
        }}
        renderLoading={() => {
          <ActivityIndicator size="large" color="white" />;
        }}
        textInputStyle={{
          color: "white",
          backgroundColor: "#3C3E3E",
          borderRadius: 20,
          paddingLeft: 15,
        }}
        textInputProps={{
          multiline: true,
        }}
        alwaysShowSend
        renderInputToolbar={(props) => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: "black",
                borderTopColor: "black",
                marginBottom: 3,
              }}
            />
          );
        }}
        renderSend={(props) => {
          return (
            <Send {...props}>
              <MaterialCommunityIcons
                name="send-circle"
                size={38}
                color="#CF406E"
                style={{ paddingHorizontal: 10, alignItems: "center" }}
              />
            </Send>
          );
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: "#ae1297",
                },

                left: {
                  backgroundColor: "#3C3E3E",
                },
              }}
              textStyle={{
                left: {
                  color: "white",
                },
              }}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoImage: {
    height: 50,
    width: 50,
    resizeMode: "contain",
    marginRight: 10,
    borderRadius: 500,
    overflow: "hidden",
  },
  logoTitle: {
    fontSize: 22,
    fontWeight: "500",
    color: "white",
    lineHeight: 50,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
});

export default ChatScreen;
