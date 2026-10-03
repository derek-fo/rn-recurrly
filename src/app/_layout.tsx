import { SplashScreen, Stack } from "expo-router";
import "../../global.css";
import { useEffect } from "react";
import { useFonts } from "expo-font";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
    "sans-regular: required": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-medium: required": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold: required": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-bold: required": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }}, [fontsLoaded]);

    if(!fontsLoaded) { return null; }
  return <Stack screenOptions={{ headerShown: false }} />;
}
