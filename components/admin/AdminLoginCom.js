import firebase, { firestore } from "firebase";

import firebaseConfig from "../../fireBaseWebConfig";
import "firebase/firestore";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const AdminLoginCom = (userName, password) => {
  console.log(userName);
  console.log(password);

  let db = firestore();

  const a = db.collection("AdminCred");
  a.where("UserName", "==", userName)
    .where("Password", "==", password)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.size > 0) {
        console.log("return true");
        return Promise(resolve("true"));
        
      } else {
        console.log("return false");
       return Promise((resolve("false")))
      }
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
      return false;
    });
};

export default AdminLoginCom;
