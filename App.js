import { StyleSheet, Text, View, Image, Button } from "react-native";
import Constants from "expo-constants";
import { Formik } from "formik";

// Own dependecies
import AppInput from "./components/Form/Input";
import Logo from "./components/Logo/Logo";

export default function App() {
  return (
    <View style={styles.container}>
      <Logo />
      <View style={styles.form}>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => console.log(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <>
              <AppInput
                autoCorrect={false}
                autoComplete={false}
                name="email"
                onChange={handleChange("email")}
                placeholder="Enter email"
                value={values.email}
              />

              <AppInput
                autoCorrect={false}
                autoComplete={false}
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
