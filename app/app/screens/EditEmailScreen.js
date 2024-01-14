import React from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";

import { changeEmail } from "../api/Auth";
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
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function EditEmailScreen({ navigation }) {
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
  const handleSubmit = ({ password, email }) => {
    setLoadingVisible(true);
    changeEmail(
      {
        currentPassword: password,
        newEmail: email,
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
              initialValues={{ email: "", password: "" }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <View style={styles.row}>
                <ErrorMessage error={errorMessage} visible={loginFailed} />
                <AppSubtitle style={[Colors.gray, styles.label]}>
                  email
                </AppSubtitle>
                <AppFormField
                  name="email"
                  colors={colors.gray}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  placeholder="email"
                  textContentType="emailAddress"
                />
                <View style={styles.row}>
                  <AppSubtitle style={[Colors.gray, styles.label]}>
                    wachtwoord
                  </AppSubtitle>
                  <AppFormField
                    name="password"
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
export default EditEmailScreen;
