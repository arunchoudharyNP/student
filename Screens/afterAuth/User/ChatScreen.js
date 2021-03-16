import React, { useState } from "react";
import { Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

const ChatScreen = (props) => {
 
  const [messages, setmessages] = useState([
    {
      _id: 1,
      text: "Hello developer",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "React Native",
        avatar: "https://facebook.github.io/react/img/logo_og.png",
      },
    },
    {
        _id: 3,
        text: "How Can i help you?",
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "Friend",
          avatar: "https://facebook.github.io/react/img/logo_og.png",
        },
      },
  ]);

  const onSend = (msg = []) => {

    GiftedChat.append(previousState, msg),
    setmessages((previousState) => [
      ...previousState, msg
     
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
          name: "hulk",
        }}
      />
    </View>
  );
};

export default ChatScreen;
