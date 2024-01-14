import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import colors from "../../config/colors";

function ImageInput({ onChangeImage }) {
  const [image, setImage] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!status) {
          alert("Sorry we hebben toegang nodig om verder te gaan.");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!pickerResult.cancelled) {
      setImage(pickerResult.uri);
      onChangeImage(pickerResult.uri);
    }
  };

  const takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!pickerResult.cancelled) {
      setImage(pickerResult.uri);
      onChangeImage(pickerResult.uri);
    }
  };

  return (
    <View style={styles.paddingTop}>
      <View style={styles.row}>
        <TouchableWithoutFeedback onPress={takePhoto}>
          <Ionicons name="camera" size={30} color={colors.gray} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={pickImage}>
          <Ionicons
            style={{ marginLeft: 10 }}
            name="add"
            size={30}
            color={colors.gray}
          />
        </TouchableWithoutFeedback>
      </View>
      {image && (
        <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  paddingTop: {
    paddingTop: 50,
  },
  row: {
    flexDirection: "row",
  },
});

export default ImageInput;
