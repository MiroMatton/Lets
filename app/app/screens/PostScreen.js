import React from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import * as Yup from "yup";
import { addPost } from "../api/Api";

import colors from "../config/colors";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import FormImagePicker from "../components/forms/FormImagePicker";
import AppSubtitle from "../components/AppSubtitle";
import AppBackButton from "../components/AppBackButton";
import DismissKeyboard from "../components/DismissKeyboard";
import AuthContext from "../auth/context";
import OfflineAlert from "../components/OfflineAlert";
import LoadingModal from "../components/LoadingModal";
import { Colors } from "../styles/GlobalStyle";
import { styles } from "../styles/FormStyle";

const validationSchema = Yup.object().shape({
  title: Yup.string().max(30, "max is 30").required().label("Title"),
  description: Yup.string()
    .max(500, "max is 500")
    .required()
    .label("Description"),
  pluimen: Yup.number().label("Pluimen").typeError("moet een nummer zijn"),
  image: Yup.string(),
});

function PostScreen({ navigation, route }) {
  const category = route.params;
  const [colorBG, setColorBG] = React.useState(null);
  const [loadingVisible, setLoadingVisible] = React.useState(false);
  const { user } = React.useContext(AuthContext);

  React.useEffect(() => {
    postColor(category);
  }, []);

  function getPost(item) {
    if (item) {
      navigation.pop();
      setLoadingVisible(false);
    }
  }
  const handleSubmit = ({ title, description, pluimen, image }) => {
    setLoadingVisible(true);
    addPost(
      {
        title: title,
        description: description,
        pluimen: pluimen,
        UID: user.UID,
        userImage: user.image,
        userName: user.name,
        userCity: user.city,
        category: category,
        url: image,
      },
      getPost
    );
  };

  const postColor = (param) => {
    switch (param) {
      case "hulpvraag":
        return setColorBG(colors.red);
      case "lenen":
        return setColorBG(colors.primary);
      case "aanbod":
        return setColorBG(colors.purple);
      case "ik zoek..":
        return setColorBG(colors.yellow);
      case "weggeven":
        return setColorBG(colors.green);
      default:
        return setColorBG(colors.primary);
    }
  };

  return (
    <DismissKeyboard>
      <View style={styles.container} backgroundColor={colorBG}>
        <OfflineAlert />
        <LoadingModal visible={loadingVisible} />
        <AppForm
          initialValues={{ title: "", description: "", pluimen: "", image: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <View
            style={{ flex: 3, alignItems: "center" }}
            backgroundColor={colorBG}
          >
            <View style={styles.wrapper}>
              <View
                style={styles.padding}
                behavior={Platform.OS == "ios" ? "padding" : "height"}
              >
                <AppBackButton color="white" />
              </View>
              <AppSubtitle style={styles.title}>Post - {category}</AppSubtitle>
              <AppSubtitle style={[Colors.white, styles.label]}>
                titel
              </AppSubtitle>
              <AppFormField
                name="title"
                colors={colors.white}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="titel"
              />
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.wrapper}>
              <View style={styles.row}>
                <AppSubtitle style={[Colors.gray, styles.label]}>
                  beschrijving
                </AppSubtitle>
                <AppFormField
                  name="description"
                  colors={colors.gray}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="beschrijving"
                />
              </View>
              <View style={styles.row}>
                <AppSubtitle style={[Colors.gray, styles.label]}>
                  aantal pluimen
                </AppSubtitle>
                <AppFormField
                  name="pluimen"
                  colors={colors.gray}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="numeric"
                  placeholder="aantal pluimen"
                />
              </View>
              <FormImagePicker name="image" />
              <SubmitButton
                title="Plaats bericht"
                BGcolor={colors.primary}
                TextColor={colors.white}
              />
            </View>
          </View>
        </AppForm>
      </View>
    </DismissKeyboard>
  );
}

export default PostScreen;
