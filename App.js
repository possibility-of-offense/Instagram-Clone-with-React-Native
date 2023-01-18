import { NavigationContainer } from "@react-navigation/native";

// Own Dependecies
import { AuthContext } from "./context/AuthContext";
import AuthNavigator from "./navigation/AuthNavigator";
import AppNavigator from "./navigation/AppNavigator";
import Loader from "./components/UI/Loader";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { authStateFetching, user, setUser } = useAuth();

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
