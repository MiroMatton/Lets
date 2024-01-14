import React from "react";
import { useFormikContext } from "formik";

import ErrorMessage from "./ErrorMessage";
import ImagePicker from "./ImagePicker";

function FormImagePicker({ name }) {
  const { errors, setFieldValue, touched } = useFormikContext();

  const handleAdd = (uri) => {
    setFieldValue(name, uri);
  };

  return (
    <>
      <ImagePicker onChangeImage={handleAdd} />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default FormImagePicker;
