import React from "react";
import { View, Platform } from "react-native";

import { changeUserinfo } from "../api/Auth";
import * as Yup from "yup";

import colors from "../config/colors";
import AppSubtitle from "../components/AppSubtitle";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import AppBackButton from "../components/AppBackButton";
import DismissKeyboard from "../components/DismissKeyboard";
import FormImagePicker from "../components/forms/FormImagePicker";
import ErrorMessage from "../components/forms/ErrorMessage";
import AuthContext from "../auth/context";
import OfflineAlert from "../components/OfflineAlert";
import LoadingModal from "../components/LoadingModal";
import { Colors } from "../styles/GlobalStyle";
import { styles } from "../styles/FormStyle";

const validationSchema = Yup.object().shape({
  name: Yup.string().max(30, "max is 30").label("Name"),
  city: Yup.string().max(30, "max is 30").label("City"),
  image: Yup.string(),
});

function EditUserinfoScreen({ navigation }) {
  const { user } = React.useContext(AuthContext);
  const [loginFailed, setLoginFailed] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(false);
  const [loadingVisible, setLoadingVisible] = React.useState(false);

  async function setUser(userData, message) {
    if (!userData) {
      setLoadingVisible(false);
      return setLoginFailed(true), setErrorMessage(message);
    } else {
      setLoadingVisible(false);
      navigation.pop();
    }
  }
  const handleSubmit = ({ name, city, image }) => {
    setLoadingVisible(true);
    changeUserinfo(
      {
        UID: user.UID,
        name: name ? name : user.name,
        city: city ? city : user.city,
        url: image ? image : user.image,
      },
      setUser
    );
  };
  return (
    <DismissKeyboard>
      <View
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <LoadingModal visible={loadingVisible} />
        <OfflineAlert />
        <View style={styles.top}>
          <View style={styles.wrapper}>
            <AppBackButton color="white" />
            <AppSubtitle style={styles.title}>gebruiker gegevens</AppSubtitle>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.wrapper}>
            <AppForm
              initialValues={{
                name: "",
                city: "",
                image: "",
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <View style={styles.row}>
                <ErrorMessage error={errorMessage} visible={loginFailed} />
                <View style={styles.row}>
                  <ErrorMessage error={errorMessage} visible={loginFailed} />
                  <AppSubtitle style={[Colors.gray, styles.label]}>
                    naam
                  </AppSubtitle>
                  <AppFormField
                    name="name"
                    colors={colors.gray}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="naam"
                    textContentType="name"
                  />
                </View>
                <View style={styles.row}>
                  <AppSubtitle style={[Colors.gray, styles.label]}>
                    gemeente
                  </AppSubtitle>
                  <AppFormField
                    name="city"
                    colors={colors.gray}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="gemeente"
                    textContentType="addressCity"
                  />
                </View>
                <FormImagePicker name="image" />
              </View>
              <View style={styles.buttons}>
                <SubmitButton
                  title="Change"
                  BGcolor={colors.primary}
                  TextColor={colors.white}
                />
              </View>
            </AppForm>
          </View>
        </View>
      </View>
    </DismissKeyboard>
  );
}

export default EditUserinfoScreen;
