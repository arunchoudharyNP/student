import React, { useState, useEffect } from "react";
import { Text, View ,FlatList} from "react-native";
import { useSelector } from "react-redux";
import UserCard from "../../../components/admin/UserCard";

const Users = (props) => {
  const [OTP, setOTP] = useState([]);
  const otp = useSelector((state) => state.UsersOTP.OTP);
 console.log(otp)
 
  useEffect(() => {
    setOTP(otp)

  }, [otp]);

  return (
    <View>
       <UserCard  data={OTP} />
    </View>
  );
};

export default Users;
