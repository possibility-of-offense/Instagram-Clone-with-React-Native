import { StyleSheet, Text, View, Image, Button } from "react-native";
import Constants from "expo-constants";
import { Formik } from "formik";
import * as Yup from "yup";

// Own dependecies
import AppInput from "./components/Form/Input";
import Logo from "./components/Logo/Logo";

// Validation
const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

export default function App() {
  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.form}>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => console.log(values)}
          validationSchema={validationSchema}
        >
          {({ handleChange, handleBlur, errors, handleSubmit, values }) => (
            <>
              <AppInput
                autoCorrect={false}
                autoComplete="off"
                error={errors.email}
                name="email"
                onChange={handleChange("email")}
                placeholder="Enter email"
                value={values.email}
              />

              <AppInput
                autoCorrect={false}
                autoComplete="off"
                error={errors.password}
                name="password"
                onChange={handleChange("password")}
                placeholder="Enter password"
                secureTextEntry
                value={values.password}
              />
              <Button title="Click" onPress={handleSubmit} />
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 10,
    marginHorizontal: 10,
    textAlign: "center",
    alignItems: "center",
  },
  form: {
    paddingVertical: 20,
    width: "80%",
  },
});
