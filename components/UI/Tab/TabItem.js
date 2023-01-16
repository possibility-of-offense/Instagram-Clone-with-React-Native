import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native";

// Own Dependecies
import colors from "../../../themes/colors";

const TabItem = (currentRoute, icon, route, text, type) => {
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
      borderRightColor: currentRoute === route ? colors.primary : colors.dark,
      borderRightWidth: 1,
    },
    tabBarBadgeStyle: {
      color: "red",
    },
    tabBarLabel: ({ focused }) => (
      <Text style={{ color: focused ? colors.primary : colors.dark }}>
        {text}
      </Text>
    ),
  };
};

export default TabItem;
