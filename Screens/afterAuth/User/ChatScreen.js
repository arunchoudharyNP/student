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

  useEffect(() => {
    init(name + room)
      .then(() => {
        console.log("DB Initialized");
        dispatch(ChatActions.loadMessages(name + room));
      })
      .catch((err) => {
        console.log("DB initialization failed " + err);
      });
  }, []);

  storeMesseges = useSelector((state) =>
    state.ChatReducers.messages
      ? state.ChatReducers.messages
      : [
          {
            _id: "Dummy_Bot_Welcome_message",
            createdAt: new Date(),
            text: "Hello, Welcome to the Sane App. Send hello to your friend.",
            user: {
              _id: 3,
              name: "Bot",
            },
          },
        ]
  );

  const currentMessageId = useRef(
    storeMesseges.length > 0
      ? storeMesseges.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )[storeMesseges.length - 1]._id
      : "Dummy"
  );

  console.log("storeMessages");
  console.log(storeMesseges);

  const dispatch = useDispatch();
  const [messages, setmessages] = useState([]);

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

  const checkMessages = (messageFireStore) => {
    let flag = true;
    messageFireStore.forEach((data) => {
      const exist = storeMesseges.findIndex((msg) => msg._id == data._id);

      if (exist < 0) {
        flag = false;
        return flag;
      }

      return flag;
    });
    return flag;
  };

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
        if (storeMesseges && !checkMessages(messageFireStore)) {
          console.log("Called");

          messageFireStore.forEach((data) => {
            dispatch(ChatActions.addMessage(data, name + room));
          });

          // console.log(currentMessage);
          if (messageFireStore[messageFireStore.length - 1].user._id == 2) {
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

    return () => {
      unsubscribe();
    };
  }, []);

  const appendMessages = (msg) => {
    setmessages((prevState) => GiftedChat.append(prevState, msg));
  };

  const onSend = async (msg) => {
    const writes = msg.map((m) => {
      currentMessageId.current = m._id;
      const encryptText = AES.encrypt(m.text, m._id).toString();
      m.text = encryptText;

      chatRef.add(m);
    });

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
