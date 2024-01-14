import { firebase } from "../../Firebase";
import { uploadImageAsync } from "./Api";

/* 
  authentication
*/

export async function singUp(userInfo, addComplete) {
  let user;
  let signUpFailed = false;

  await firebase
    .auth()
    .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
    .then((userCredentials) => {
      user = userCredentials.user;
      console.log("Registered with:", user.email);
      UID = user.uid;
    })
    .catch(
      (error) => (addComplete(false, error.message), (signUpFailed = true))
    );

  if (!signUpFailed) {
    const url = await uploadImageAsync(userInfo.url);

    await firebase.firestore().collection("users").doc(user.uid).set({
      UID: user.uid,
      name: userInfo.name,
      city: userInfo.city,
      image: url,
      token: "i",
      notifications: false,
    });

    await firebase.firestore().collection("userChatRooms").doc(user.uid).set({
      exists: true,
    });

    await firebase
      .firestore()
      .collection("wallets")
      .add({
        UID: user.uid,
        credit: 50,
      })
      .then(() => addComplete(user));
  }
}

export async function login(userInfo, addComplete) {
  let user;

  await firebase
    .auth()
    .signInWithEmailAndPassword(userInfo.email, userInfo.password)
    .then((userCredentials) => {
      user = userCredentials.user;
      console.log("Logged in with:", user.email);
      addComplete(user);
    })
    .catch((error) => addComplete(false, error.message));
}

async function reauthenticate(currentPassword) {
  let user = firebase.auth().currentUser;
  let credentials = firebase.auth.EmailAuthProvider.credential(
    user.email,
    currentPassword
  );
  return user.reauthenticateWithCredential(credentials);
}

export async function changeEmail(form, addComplete) {
  reauthenticate(form.currentPassword)
    .then(() => {
      let user = firebase.auth().currentUser;
      user
        .updateEmail(form.newEmail)
        .then(() => addComplete(true))
        .catch((error) => {
          addComplete(false, error.message);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function changePassword(form, addComplete) {
  reauthenticate(form.currentPassword)
    .then(() => {
      let user = firebase.auth().currentUser;
      user
        .updatePassword(form.newPassword)
        .then(() => addComplete(true))
        .catch((error) => {
          addComplete(false, error.message);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function changeUserinfo(userInfo, addComplete) {
  if (userInfo.url) {
    url = await uploadImageAsync(userInfo.url);
  }
  await firebase
    .firestore()
    .collection("users")
    .doc(userInfo.UID)
    .update({
      name: userInfo.name,
      city: userInfo.city,
      image: url,
    })
    .then(() => addComplete(true))
    .catch((error) => {
      addComplete(false, error.message);
    });
}
