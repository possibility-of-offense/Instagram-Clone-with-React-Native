import { NavigationContainer } from "@react-navigation/native";

// Own dependecies
import { AuthContext } from "./context/AuthContext";
import AuthNavigator from "./navigation/AuthNavigator";
import AppNavigator from "./navigation/AppNavigator";
import Loader from "./components/UI/Loader";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { authStateFetching, user } = useAuth();

  return (
    <AuthContext.Provider value={{ user }}>
      <NavigationContainer>
        {authStateFetching ? (
          <Loader visible={true} />
        ) : user ? (
          <AppNavigator />
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
