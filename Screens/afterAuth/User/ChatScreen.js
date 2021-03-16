import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { firestore } from "firebase";

const ChatScreen = (props) => {
  const { id, room } = props.route.params;

  // const id = props.navigation.getParam("id");
  // const room = props.navigation.getParam("room");
  console.log(props);
  console.log(id);
  console.log(room);
  const db = firestore();
  const chatRef = db.collection("ServiceAccount").doc(id).collection(room);

  useEffect(() => {
    const unsubscribe = chatRef.onSnapshot((querySnapShot) => {
      const messageFireStore = querySnapShot
        .docChanges()
        .filter(({ type }) => (type = "added"))
        .map(({ doc }) => {
          const message = doc.data();
          return { ...message,createdAt:message.createdAt.toDate() };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      appendMessages(messageFireStore);
    });

    return () => unsubscribe();
  }, []);

  const appendMessages = (msg) => {
    setmessages((prevState) => GiftedChat.append(prevState, msg));
  };

  const [messages, setmessages] = useState([
    // {
    //   _id: 1,
    //   text: "Joined to New Room",
    //   createdAt: new Date(),
    //   user: {
    //     _id: 2,
    //     name: "React Native",
    //     // avatar: "https://facebook.github.io/react/img/logo_og.png",
    //   },
    // },
  ]);

  const onSend = async (msg) => {
    const writes = msg.map((m) =>
      chatRef.add(m)
    );
    await Promise.all(writes);
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
          name: room,
        }}
      />
    </View>
  );
};

export default ChatScreen;
