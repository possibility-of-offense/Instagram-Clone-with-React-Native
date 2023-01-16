import React from "react";
import LottieView from "lottie-react-native";

function Loader({ visible = false }) {
  if (!visible) return null;

  return (
    <LottieView
      autoPlay
      loop
      source={require("../../assets/animations/114192-loading-spinner.json")}
    />
  );
}

export default Loader;
