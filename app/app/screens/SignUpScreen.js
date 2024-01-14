import React from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
import * as Yup from "yup";
import { getUserInfo } from "../api/Api";
import { singUp } from "../api/Auth";

import colors from "../config/colors";
import AppSubtitle from "../components/AppSubtitle";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import AppButtonOutline from "../components/AppButtonOutline";
import AppBackButton from "../components/AppBackButton";
import DismissKeyboard from "../components/DismissKeyboard";
import AuthContext from "../auth/context";
import FormImagePicker from "../components/forms/FormImagePicker";
import ErrorMessage from "../components/forms/ErrorMessage";
import OfflineAlert from "../components/OfflineAlert";
import LoadingModal from "../components/LoadingModal";
import { Colors } from "../styles/GlobalStyle";
import { styles } from "../styles/FormStyle";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().max(30, "max is 30").label("Name"),
  city: Yup.string().required().max(30, "max is 30").label("City"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  image: Yup.string().required(),
});

function SignUpScreen({ navigation }) {
  const authContext = React.useContext(AuthContext);
  const [loginFailed, setLoginFailed] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(false);
  const [loadingVisible, setLoadingVisible] = React.useState(false);

  async function setUser(userData, message) {
    if (!userData) {
      setLoadingVisible(false);
      return setLoginFailed(true), setErrorMessage(message);
    }
    const userInfo = await getUserInfo(userData.uid, true);
    authContext.setUser(userInfo);
    setLoadingVisible(false);
  }

  const handleSubmit = ({ password, email, name, city, image }) => {
    setLoadingVisible(true);
    singUp(
      {
        password: password,
        email: email,
        name: name,
        city: city,
        url: image,
      },
      setUser
    );
  };

  return (
    <ScrollView backgroundColor={colors.white}>
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
              <AppSubtitle style={styles.title}>Maak account</AppSubtitle>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.wrapper}>
              <AppForm
                initialValues={{
                  email: "",
                  password: "",
                  name: "",
                  city: "",
                  image: "",
                }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
              >
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
                <View style={styles.row}>
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
                <FormImagePicker name="image" />
                <View style={styles.buttons}>
                  <SubmitButton
                    title="Sign Up"
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
                    title="Login"
                    BGcolor={colors.white}
                    TextColor={colors.primary}
                    onPress={() => {
                      navigation.replace("Login");
                    }}
                  />
                </View>
              </AppForm>
            </View>
          </View>
        </View>
      </DismissKeyboard>
    </ScrollView>
  );
}

export default SignUpScreen;
