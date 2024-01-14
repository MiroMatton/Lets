import React from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";

import { changePassword } from "../api/Auth";
import * as Yup from "yup";

import colors from "../config/colors";
import AppSubtitle from "../components/AppSubtitle";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import AppBackButton from "../components/AppBackButton";
import DismissKeyboard from "../components/DismissKeyboard";
import ErrorMessage from "../components/forms/ErrorMessage";
import OfflineAlert from "../components/OfflineAlert";
import LoadingModal from "../components/LoadingModal";
import { Colors } from "../styles/GlobalStyle";
import { styles } from "../styles/FormStyle";

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required().min(4).label("CurrentPassword"),
  newPassword: Yup.string().required().min(4).label("NewPassword"),
});

function EditPasswordScreen({ navigation }) {
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
  const handleSubmit = ({ currentPassword, newPassword }) => {
    setLoadingVisible(true);
    changePassword(
      {
        currentPassword: currentPassword,
        newPassword: newPassword,
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
            <AppSubtitle style={styles.title}>Email veranderen</AppSubtitle>
          </View>
        </View>
        <View style={styles.form}>
          <View style={styles.wrapper}>
            <AppForm
              initialValues={{ currentPassword: "", newPassword: "" }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <View style={styles.row}>
                <ErrorMessage error={errorMessage} visible={loginFailed} />
                <AppSubtitle style={[Colors.gray, styles.label]}>
                  oud wachtwoord
                </AppSubtitle>
                <AppFormField
                  name="currentPassword"
                  colors={colors.gray}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  placeholder="wachtwoord"
                  textContentType="password"
                />
                <View style={styles.row}>
                  <AppSubtitle style={[Colors.gray, styles.label]}>
                    niew wachtwoord
                  </AppSubtitle>
                  <AppFormField
                    name="newPassword"
                    colors={colors.gray}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry
                    placeholder="wachtwoord"
                    textContentType="password"
                  />
                </View>
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

export default EditPasswordScreen;
