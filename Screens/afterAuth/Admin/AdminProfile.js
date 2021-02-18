import React,{ useLayoutEffect} from "react";
import {useDispatch}  from 'react-redux'
import { Button, Text, View ,TouchableOpacity} from "react-native";
import * as AdminActions from "../../../Store/Actions/AdminActions";
import { Ionicons  } from "@expo/vector-icons";


const AdminProfile = (props) => {

  const dispatch = useDispatch();

  const parent = props.navigation.dangerouslyGetParent();

  const logoutHandler =()=>{
     dispatch(AdminActions.logout(props.navigation));

  }

useLayoutEffect(() => {
    parent.setOptions({
      headerLeft: () => {
        return (
          <TouchableOpacity>
            <Ionicons
              name="md-menu"
              size={36}
              onPress={()=>{props.navigation.openDrawer()}}
              color="white"
              style={{ marginLeft: 20, marginTop: 5 }}
            />
          </TouchableOpacity>
        );
      },

    });
  }, [props.navigation]);

 

  return (
    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
      <Text>AdminProfile</Text>
      <Button title="LogOut"  onPress={()=>{logoutHandler()}}  />

    </View>
  );
};

export default AdminProfile;
