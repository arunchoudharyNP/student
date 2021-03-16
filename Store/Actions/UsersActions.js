export const CREATE_USER_OTP = "CREATE_USER_OTP";

export const GET_USER_OTP = "GET_USER_OTP";


import AsyncStorage from "@react-native-community/async-storage";


export const USER_AUTH = "USER_AUTH";
export const USER_LOGOUT = "USER_LOGOUT";

export const createUsersOTP = ( title, userOTP, count) => {
  
  return { type: CREATE_USER_OTP, title, userOTP, count };
};

export const getUserOTP = (data) => {
  
  return { type: GET_USER_OTP, data };
};


export const userAuth = (navigation, userName) => {
  saveDataToStorage(userName);
  navigation.navigate("verify");
  return { type: USER_AUTH, userName };
};




export const logout = (navigation) => {
  AsyncStorage.removeItem("userData");
  console.log("Storage cleaned........!");
  navigation.navigate("verify");
  return { type: USER_LOGOUT };
};

const saveDataToStorage = async (userName) => {
  // await AsyncStorage.removeItem("userData");
  try {
    const storageData = await AsyncStorage.setItem(
      "userData",
      JSON.stringify({
        userName: userName,
        
      })
    );
  } catch (error) {
    console.log("storageData............" + error + "...............");
  }
};

