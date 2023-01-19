import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native";

// Own Dependecies
import colors from "../../../themes/colors";

const BottomTabItem = (currentRoute, icon, route, text, type, last = false) => {
  return {
    tabBarIcon: ({ color, size, focused }) => {
      return type === "entypo" ? (
        <Entypo
          name={icon}
          size={size}
          color={focused ? colors.primary : colors.dark}
        />
      ) : (
        <MaterialIcons
          name={icon}
          size={size}
          color={focused ? colors.primary : colors.dark}
        />
      );
    },
    tabBarItemStyle: {
      borderRightColor:
        last === false
          ? currentRoute === route
            ? colors.primary
            : colors.dark
          : "transparent",
      borderRightWidth: last === false ? 1 : 0,
    },
    tabBarLabel: ({ focused }) => (
      <Text style={{ color: focused ? colors.primary : colors.dark }}>
        {text}
      </Text>
    ),
  };
};

export default BottomTabItem;
