import { firebase } from "../../Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserInfo } from "./Api";

/*
  chat api
*/

export async function getSearch(search, isConnected) {
  let postList = [];
  let name = "chatSearch" + search;

  if (isConnected) {
    let snapshot = await firebase.firestore().collection("users").get();

    snapshot.forEach((doc) => {
      const postItem = doc.data();
      postItem.id = doc.id;
      if (search) {
        let qeury = search.toLowerCase();
        if (
          postItem.name.indexOf(qeury) == 0 ||
          postItem.name.indexOf(search) == 0
        )
          postList.push(postItem);
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
        return value != null ? JSON.parse(value) : postList;
      } else console.log("oepsie");
    } catch (e) {
      console.log(e);
    }
  }
}

export async function checkRoomName(roomName, user1, user2, addComplete) {
  let room = await firebase
    .firestore()
    .collection("chatRooms")
    .doc(roomName)
    .collection("messages")
    .get();
  let data = room.docs.map((doc) => doc.data());
  if (data.length !== 0) {
    addComplete(data);
  } else {
    await makeRoom(roomName, user1, user2).then(() => addComplete(data));
  }
}

async function makeRoom(roomName, user1, user2) {
  await firebase.firestore().collection("chatRooms").doc(roomName).set({
    user1: user1,
    user2: user2,
  });
  await firebase
    .firestore()
    .collection("userChatRooms")
    .doc(user1)
    .update({
      [roomName]: true,
    });
  await firebase
    .firestore()
    .collection("userChatRooms")
    .doc(user2)
    .update({
      [roomName]: true,
    });
}

export async function getChatRooms(user) {
  let snapshot = await firebase
    .firestore()
    .collection("userChatRooms")
    .doc(user)
    .get();
  return snapshot.data((doc) => doc.data());
}

export async function getRoomsInfo(UID, user, addComplete) {
  let rooms = [];
  let itemsProcessed = 0;

  await UID.forEach(async (item) => {
    if (item !== "exists") {
      let snapshot = await firebase
        .firestore()
        .collection("chatRooms")
        .doc(item)
        .get();
      let data = snapshot.data((doc) => doc.data());
      if (data.user1 === user) {
        await getUserInfo(data.user2, true).then((items) => {
          rooms.push(items);
        });
      } else if (data.user2 === user) {
        await getUserInfo(data.user1, true).then((items) => {
          rooms.push(items);
        });
      }
    }
    itemsProcessed++;
    if (itemsProcessed === UID.length) {
      addComplete(rooms);
    }
  });
}
