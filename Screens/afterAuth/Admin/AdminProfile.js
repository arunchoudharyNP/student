import React from "react";
import {useDispatch}  from 'react-redux'
import { Button, Text, View } from "react-native";
import * as AdminActions from "../../../Store/Actions/AdminActions";

const AdminProfile = (props) => {

  const dispatch = useDispatch();

  const logoutHandler =()=>{
     dispatch(AdminActions.logout(props.navigation));

  }

  return (
    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
      <Text>AdminProfile</Text>
      <Button title="LogOut"  onPress={()=>{logoutHandler()}}  />


    </View>
  );
};

export default AdminProfile;
