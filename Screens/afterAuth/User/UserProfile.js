import React, { useLayoutEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CardCom from "../../../components/user/CardCom";

import { firestore } from "firebase";

const UserProfile = (props) => {

  const db = firestore();
  const parent = props.navigation.dangerouslyGetParent();

  const { name } = props.route.params;
  const [listners, setlistners] = useState([]);

  const startChat = (id,chatName,picture) => {
    const chatRef = db
      .collection("ServiceAccount")
      .doc(id)
      .set({ users: firestore.FieldValue.arrayUnion(name) }, { merge: true });

   
    props.navigation.navigate("chatScreen", { id, room: name ,name:chatName,picture});
  };

  const loadListners = () => {
    const serviceRef = db.collection("ServiceAccount");

  

    serviceRef.get().then((snapDoc) => {
      if (snapDoc.size > 0) {
        const resData = snapDoc.docs.map((element) => {
          return {
            Name: element.data().Name,
            ID: element.id,
            Picture: element.data().Picture,
          };
        });

        setlistners(resData);
      }
    });
  };
  useLayoutEffect(() => {
    loadListners();
    parent.setOptions({
      headerLeft: () => {
        return (
          <TouchableOpacity>
            <Ionicons
              name="md-menu"
              size={36}
              onPress={() => {
                parent.openDrawer();
              }}
              color="white"
              style={{ marginLeft: 20, marginTop: 5 }}
            />
          </TouchableOpacity>
        );
      },
    });
  }, [props.navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <CardCom data={listners} chatHandler={(id,name,picture) => startChat(id,name,picture)} />
    </View>
  );
};

export default UserProfile;
