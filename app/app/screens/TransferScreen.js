import React from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import * as Yup from "yup";
import { transfer } from "../api/Wallet";

import colors from "../config/colors";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import AppSubtitle from "../components/AppSubtitle";
import AppBackButton from "../components/AppBackButton";
import DismissKeyboard from "../components/DismissKeyboard";
import AuthContext from "../auth/context";
import OfflineAlert from "../components/OfflineAlert";
import LoadingModal from "../components/LoadingModal";
import ErrorMessage from "../components/forms/ErrorMessage";
import { Colors } from "../styles/GlobalStyle";
import { styles } from "../styles/FormStyle";

const validationSchema = Yup.object().shape({
  id: Yup.string().required().label("Id"),
  pluimen: Yup.number()
    .required()
    .label("Pluimen")
    .typeError("moet een nummer zijn"),
  description: Yup.string()
    .max(30, "max is 30")
    .required()
    .label("Description"),
});

function TransferScreen({ navigation, route }) {
  const router = route.params;
  const { user } = React.useContext(AuthContext);
  const [loadingVisible, setLoadingVisible] = React.useState(false);
  const [transferFailed, setTransferFailed] = React.useState(false);

  function getTransaction(item) {
    if (item) {
      setLoadingVisible(false);
      navigation.pop();
    } else {
      setLoadingVisible(false);
      setTransferFailed(true);
    }
  }
  const handleSubmit = ({ description, pluimen, id }) => {
    setLoadingVisible(true);
    transfer(
      {
        UID: user.UID,
        name: user.name,
        walletSender: router.walletInfo.id,
        cerditUser: router.walletInfo.credit,
        walletReceiver: id,
        description: description,
        amount: pluimen,
      },
      getTransaction
    );
  };
  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <LoadingModal visible={loadingVisible} />
        <OfflineAlert />
        <AppForm
          initialValues={{ id: "", pluimen: "", description: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <View style={styles.top}>
            <View style={styles.wrapper}>
              <View behavior={Platform.OS == "ios" ? "padding" : "height"}>
                <AppBackButton color="white" />
              </View>
              <AppSubtitle style={styles.title}>Overschrijving</AppSubtitle>
            </View>
          </View>
          <View style={styles.form}>
            <View style={styles.wrapper}>
              <View style={styles.row}>
                <ErrorMessage
                  error="wallet nummer bestaat niet"
                  visible={transferFailed}
                />
                <AppSubtitle style={[Colors.gray, styles.label]}>
                  wallet nummer
                </AppSubtitle>
                <AppFormField
                  name="id"
                  colors={colors.gray}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="geef ontvanger wallet nummer"
                />
              </View>
              <View style={styles.row}>
                <AppSubtitle style={[Colors.gray, styles.label]}>
                  bescrijving
                </AppSubtitle>
                <AppFormField
                  name="description"
                  colors={colors.gray}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="beschrijving voor transactie"
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
              <View style={styles.row}>
                <SubmitButton
                  title="Maak overschijving"
                  BGcolor={colors.primary}
                  TextColor={colors.white}
                />
              </View>
            </View>
          </View>
        </AppForm>
      </View>
    </DismissKeyboard>
  );
}

export default TransferScreen;
