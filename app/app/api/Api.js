import { firebase } from "../../Firebase";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

const timeStamp = firebase.firestore.FieldValue.serverTimestamp();

/* 
  posts api
*/

export async function getFeed(isConnected) {
  let postList = [];

  if (isConnected) {
    let snapshot = await firebase
      .firestore()
      .collection("posts")
      .orderBy("createdAt", "desc")
      .get();

    snapshot.forEach((doc) => {
      const postItem = doc.data();
      postItem.id = doc.id;
      postList.push(postItem);
    });

    try {
      const jsonValue = JSON.stringify(postList);
      if (!snapshot.empty) {
        await AsyncStorage.setItem("@Feed", jsonValue);
      }
    } catch (e) {
      console.log(e);
    }

    return postList;
  } else {
    try {
      const value = await AsyncStorage.getItem("@Feed");
      if (value !== null) {
        const jsonValue = await AsyncStorage.getItem("@Feed");
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } else console.log("oepsie");
    } catch (e) {
      console.log(e);
    }
  }
}

export async function getUserPosts(UID, isConnected) {
  let name = "@UserPosts" + UID;
  let postList = [];

  if (isConnected) {
    let snapshot = await firebase
      .firestore()
      .collection("posts")
      .where("UID", "==", UID)
      .get();

    snapshot.forEach((doc) => {
      const postItem = doc.data();
      postItem.id = doc.id;
      postList.push(postItem);
    });

    try {
      const jsonValue = JSON.stringify(postList);
      if (!snapshot.empty) {
        await AsyncStorage.setItem(name, jsonValue);
      }
    } catch (e) {
      console.log(e);
    }

    return postList;
  } else {
    try {
      const value = await AsyncStorage.getItem(name);
      if (value !== null) {
        const jsonValue = await AsyncStorage.getItem(name);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } else console.log("oepsie");
    } catch (e) {
      console.log(e);
    }
  }
}

export async function addPost(post, addComplete) {
  let url = null;
  if (post.url) {
    url = await uploadImageAsync(post.url);
  }
  firebase
    .firestore()
    .collection("posts")
    .add({
      title: post.title,
      description: post.description,
      pluimen: post.pluimen,
      UID: post.UID,
      image: url,
      category: post.category,
      createdAt: timeStamp,
    })
    .then(() => addComplete(post))
    .catch((error) => console.log(error));
}

export async function getSearch(search, isConnected) {
  let postList = [];
  let name = "search" + search;

  if (isConnected) {
    let snapshot = await firebase
      .firestore()
      .collection("posts")
      .orderBy("createdAt")
      .get();

    snapshot.forEach((doc) => {
      const postItem = doc.data();
      postItem.id = doc.id;
      if (search) {
        let qeury = search.toLowerCase();
        if (postItem.title.indexOf(qeury) == 0) postList.push(postItem);
      }
    });

    try {
      const jsonValue = JSON.stringify(postList);
      if (!snapshot.empty) {
        await AsyncStorage.setItem(name, jsonValue);
      }
    } catch (e) {
      console.log(e);
    }

    return postList;
  } else {
    try {
      const value = await AsyncStorage.getItem(name);
      if (value !== null) {
        return value != null ? JSON.parse(value) : postlist;
      } else console.log("oepsie");
    } catch (e) {
      console.log(e);
    }
  }
}

export async function getSearchCategory(search, category, isConnected) {
  let postList = [];
  let name = "searchCategory" + search;

  if (isConnected) {
    if (category) {
      let snapshot = await firebase
        .firestore()
        .collection("posts")
        .where("category", "==", category)
        .orderBy("createdAt")
        .get();

      snapshot.forEach((doc) => {
        const postItem = doc.data();
        postItem.id = doc.id;
        if (search) {
          let qeury = search.toLowerCase();
          if (postItem.title.indexOf(qeury) == 0) postList.push(postItem);
        }
      });

      try {
        const jsonValue = JSON.stringify(postList);
        if (!snapshot.empty) {
          await AsyncStorage.setItem(name, jsonValue);
        }
      } catch (e) {
        console.log(e);
      }

      return postList;
    } else return await getSearch(search, true);
  } else {
    try {
      const value = await AsyncStorage.getItem(name);
      if (value !== null) {
        return value != null ? JSON.parse(value) : postList;
      } else console.log("oepsie");
    } catch (e) {
      console.log(e);
    }
  }
}

/* 
  userInfo api
*/

export async function getUserInfo(UID, isConnected) {
  let name = "@userInfo:" + UID;
  if (isConnected) {
    let snapshot = await firebase
      .firestore()
      .collection("users")
      .doc(UID)
      .get();

    try {
      const jsonValue = JSON.stringify(snapshot.data((doc) => doc.data()));
      if (!snapshot.empty) {
        await AsyncStorage.setItem(name, jsonValue);
      }
    } catch (e) {
      console.log(e);
    }

    return snapshot.data((doc) => doc.data());
  } else {
    try {
      const value = await AsyncStorage.getItem(name);
      if (value !== null) {
        const jsonValue = await AsyncStorage.getItem(name);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } else console.log("chache empty");
    } catch (e) {
      console.log(e);
    }
  }
}

// image uploader

// https://snack.expo.dev/@onrun/firebase-upload-image
export async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child("/images/" + uuid.v4());
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}

export async function updateNotificationToken(token, user) {
  await firebase.firestore().collection("users").doc(user).update({
    token: token,
  });
}

export async function updateNotification(enable, user) {
  await firebase.firestore().collection("users").doc(user).update({
    notifications: enable,
  });
}
