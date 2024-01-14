import { firebase } from "../../Firebase";
import { getUserInfo } from "./Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const timeStamp = firebase.firestore.FieldValue.serverTimestamp();

// wallet

export async function getWallet(UID, isConnected) {
  let name = "@wallet:" + UID;
  let walletInfo;
  if (isConnected) {
    let snapshot = await firebase
      .firestore()
      .collection("wallets")
      .where("UID", "==", UID)
      .get();

    snapshot.forEach((doc) => {
      walletInfo = doc.data();
      walletInfo.id = doc.id;
    });

    try {
      const jsonValue = JSON.stringify(walletInfo);
      if (!snapshot.empty) {
        await AsyncStorage.setItem(name, jsonValue);
      }
    } catch (e) {
      console.log(e);
    }

    return walletInfo;
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

export async function getTransactions(UID, userUID, isConnected) {
  let Transactions = [];

  if (isConnected) {
    let snapshot = await firebase
      .firestore()
      .collection("wallets")
      .doc(UID)
      .collection("transactions")
      .where("UID", "==", userUID)
      .orderBy("createdAt", "desc")
      .get();

    snapshot.forEach((doc) => {
      const TransactionItem = doc.data();
      TransactionItem.id = doc.id;
      Transactions.push(TransactionItem);
    });

    try {
      const jsonValue = JSON.stringify(Transactions);
      if (!snapshot.empty) {
        await AsyncStorage.setItem("@transactions", jsonValue);
      }
    } catch (e) {
      console.log(e);
    }

    return Transactions;
  } else {
    try {
      const value = await AsyncStorage.getItem("@transactions");
      if (value !== null) {
        const jsonValue = await AsyncStorage.getItem("@transactions");
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } else console.log("oepsie");
    } catch (e) {
      console.log(e);
    }
  }
}

async function getWalletDoc(UID) {
  let snapshot = await firebase
    .firestore()
    .collection("wallets")
    .doc(UID)
    .get()
    .catch((error) => {
      console.log(error);
      return false;
    });
  return snapshot.data((doc) => doc.data());
}

async function transaction(post, walletInfoReceiver) {
  const userInfo = await getUserInfo(walletInfoReceiver.UID);
  if (userInfo.notifications) {
    const message = {
      to: userInfo.token,
      sound: "default",
      title: "Transfer",
      body: "je hebt : " + post.amount + "plijmen gekregen",
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  // transaction receiver
  await firebase
    .firestore()
    .collection("wallets")
    .doc(post.walletReceiver)
    .collection("transactions")
    .add({
      UID: walletInfoReceiver.UID,
      UserName: post.name,
      amount: "+" + post.amount,
      description: post.description,
      createdAt: timeStamp,
    })
    .catch((error) => console.log(error));

  // transaction sender
  await firebase
    .firestore()
    .collection("wallets")
    .doc(post.walletSender)
    .collection("transactions")
    .add({
      UID: post.UID,
      UserName: userInfo.name,
      amount: "-" + post.amount,
      description: post.description,
      createdAt: timeStamp,
    })
    .catch((error) => console.log(error));
}

export async function transfer(post, addComplete) {
  post.createdAt = firebase.firestore.FieldValue.serverTimestamp();

  await getWalletDoc(post.walletReceiver)
    .then(async (response) => {
      if (!response) {
        addComplete(false);
        return;
      } else {
        let walletInfoReceiver = response;
        await firebase
          .firestore()
          .collection("wallets")
          .doc(post.walletSender)
          .update({
            credit: parseInt(post.cerditUser) - parseInt(post.amount),
          })
          .catch((error) => console.log(error));

        await firebase
          .firestore()
          .collection("wallets")
          .doc(post.walletReceiver)
          .update({
            credit: parseInt(walletInfoReceiver.credit) + parseInt(post.amount),
          })
          .catch((error) => console.log(error));

        await transaction(post, walletInfoReceiver)
          .then(() => addComplete(post))
          .catch((error) => console.log(error));
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
