import Constants from "expo-constants";
import { Formik } from "formik";
import React, { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { StyleSheet, Text, View } from "react-native";
import * as Yup from "yup";
import { useNetInfo } from "@react-native-community/netinfo";

// Own Dependencies
import AppInput from "../components/UI/Input";
import { auth } from "../firebase/config";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/UI/Button";
import colors from "../themes/colors";
import Logo from "../components/Logo/Logo";
import Loader from "../components/UI/Loader";
import Error from "../components/UI/Error";

// Validation
const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email input"),
  password: Yup.string()
    .required()
    .min(6, "Enter at least 6 characters for the password")
    .label("Password"),
});

function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authContext = useContext(AuthContext);

  const netInfo = useNetInfo();

  const handleLogin = async (values) => {
    if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false)
      return;

    try {
      setError(null);
      setLoading(true);
      const userInfo = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      authContext.setUser(userInfo);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.code);
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.form}>
        <Formik
          initialValues={{ email: "test@test.bg", password: "1123456" }}
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
                disabled={loading}
                styleObject={{
                  loginBtn: styles.loginBtn,
                  loginBtnText: styles.loginBtnText,
                }}
                title="Login"
                onPress={handleSubmit}
                underlayColor={colors.primaryWithoutOpacity}
              />
            </>
          )}
        </Formik>
      </View>

      {error && <Error error={error} />}

      {netInfo.type !== "unknown" && netInfo.isInternetReachable === false ? (
        <Error error="The internet is gone!" />
      ) : (
        loading && (
          <View style={styles.animation}>
            <Loader visible={loading} />
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  animation: { width: 250, height: 130 },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 10,
    textAlign: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  form: {
    paddingVertical: 20,
    width: "80%",
  },
  loginBtn: {
    backgroundColor: colors.primary,
    marginTop: 10,
  },
  loginBtnText: {
    textAlign: "center",
    color: colors.white,
    fontSize: 17,
    letterSpacing: 0.4,
  },
});

export default LoginScreen;
