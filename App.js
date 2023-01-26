import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "./hooks/useAuth";

// Own Dependecies
import { AuthContext } from "./context/AuthContext";
import AuthNavigator from "./navigation/AuthNavigator";
import AppNavigator from "./navigation/AppNavigator";
import Loader from "./components/UI/Loader";
import { Button } from "react-native";
import { useRef } from "react";

export default function App() {
  const { authStateFetching, user, setUser } = useAuth();
  const navigationRef = useRef(null);

  // const handlePress = () => {
  //   navigationRef.current?.navigate("Home");
  // };

  return (
    <AuthContext.Provider value={{ user }}>
      <NavigationContainer ref={navigationRef}>
        {authStateFetching ? (
          <Loader visible={true} />
        ) : user ? (
          <AppNavigator />
        ) : (
          <AuthNavigator />
        )}

        {/* <Button style={{ marginTop: 80 }} title="Go" onPress={handlePress} /> */}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
