import React from "react";
import { useFormikContext } from "formik";

import AppButton from "../AppButton";

function SubmitButton({ title, BGcolor, TextColor }) {
  const { handleSubmit } = useFormikContext();

  return (
    <AppButton
      title={title}
      BGcolor={BGcolor}
      TextColor={TextColor}
      onPress={handleSubmit}
    />
  );
}

export default SubmitButton;
