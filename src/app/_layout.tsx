import { SplashScreen, Stack } from "expo-router";
import "../../global.css";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

SplashScreen.preventAutoHideAsync();

const getPublishableKey = (): string => {
  const key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to your .env file.");
  }
  return key;
};

const publishableKey = getPublishableKey();

const RootNavigator = ({ fontsLoaded }: { fontsLoaded: boolean }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const isReady = fontsLoaded && isLoaded;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!isSignedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="subscriptions/[id]" />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
};

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
    "sans-regular: required": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-medium: required": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold: required": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-bold: required": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-extrabold: required": require("../../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootNavigator fontsLoaded={fontsLoaded} />
    </ClerkProvider>
  );
}
