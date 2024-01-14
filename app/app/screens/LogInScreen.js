import React from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";

import { getUserInfo } from "../api/Api";
import { login } from "../api/Auth";
import * as Yup from "yup";

import colors from "../config/colors";
import AppSubtitle from "../components/AppSubtitle";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import AppButtonOutline from "../components/AppButtonOutline";
import AuthContext from "../auth/context";
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

function LogInScreen({ navigation }) {
  const authContext = React.useContext(AuthContext);
  const [loginFailed, setLoginFailed] = React.useState(false);
  const [loadingVisible, setLoadingVisible] = React.useState(false);

  async function setUser(userData) {
    if (!userData) {
      setLoadingVisible(false);
      return setLoginFailed(true);
    }
    const userInfo = await getUserInfo(userData.uid, true);
    authContext.setUser(userInfo);
    setLoadingVisible(false);
  }
  const handleSubmit = ({ password, email }) => {
    setLoadingVisible(true);
    login(
      {
        password: password,
        email: email,
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
            <AppSubtitle style={styles.title}>Welkom terug</AppSubtitle>
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
                <ErrorMessage
                  error="Ongeldige e-mail en / of wachtwoord."
                  visible={loginFailed}
                />
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
              </View>
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
              <View style={Colors.buttons}>
                <SubmitButton
                  title="Login"
                  BGcolor={colors.primary}
                  TextColor={colors.white}
                />
                <View style={styles.or}>
                  <View style={styles.line} />
                  <View>
                    <AppSubtitle style={{ width: 50, textAlign: "center" }}>
                      of
                    </AppSubtitle>
                  </View>
                  <View style={styles.line} />
                </View>
                <AppButtonOutline
                  title="Sign Up"
                  BGcolor={colors.white}
                  TextColor={colors.primary}
                  onPress={() => {
                    navigation.replace("SignUp");
                  }}
                />
              </View>
            </AppForm>
          </View>
        </View>
      </View>
    </DismissKeyboard>
  );
}

export default LogInScreen;
