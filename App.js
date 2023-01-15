import { StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { Formik } from "formik";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";

// Own dependecies
import AppInput from "./components/UI/Input";
import Button from "./components/UI/Button";
import Logo from "./components/Logo/Logo";
import { auth } from "./firebase/config";

// Validation
const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email input"),
  password: Yup.string()
    .required()
    .min(6, "Enter at least 6 characters for the password")
    .label("Password"),
});

export default function App() {
  const handleLogin = async (values) => {
    console.log(5);
    const res = await signInWithEmailAndPassword(
      auth,
      "test@test.bg",
      "123456"
    );
    console.log(res);
  };

  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.form}>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => handleLogin(values)}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            errors,
            handleSubmit,
            setFieldTouched,
            values,
            touched,
          }) => (
            <>
              <AppInput
                autoCorrect={false}
                autoComplete="off"
                error={errors.email}
                name="email"
                onBlur={() => setFieldTouched("email")}
                onChange={handleChange("email")}
                placeholder="Enter email"
                value={values.email}
                visible={touched.email}
              />

              <AppInput
                autoCorrect={false}
                autoComplete="off"
                error={errors.password}
                name="password"
                onBlur={() => setFieldTouched("password")}
                onChange={handleChange("password")}
                placeholder="Enter password"
                secureTextEntry
                value={values.password}
                visible={touched.password}
              />

              <Button
                styleObject={{
                  loginBtn: styles.loginBtn,
                  loginBtnText: styles.loginBtnText,
                }}
                title="Login"
                onPress={handleSubmit}
                underlayColor="rgba(0, 149, 246, 1)"
              />
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
  loginBtn: {
    backgroundColor: "rgba(0, 149, 246, .7)",
    marginTop: 10,
  },
  loginBtnText: {
    textAlign: "center",
    color: "white",
    fontSize: 17,
    letterSpacing: 0.4,
  },
});
