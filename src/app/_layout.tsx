import { SplashScreen, Stack } from "expo-router";
import "../../global.css";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { resourceCache } from "@clerk/expo/resource-cache";
import { colors } from "../../constants/theme";

SplashScreen.preventAutoHideAsync();

const getPublishableKey = (): string => {
  const key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to your .env file.");
  }
  return key;
};

const publishableKey = getPublishableKey();

// How long the splash may wait for the session before showing a connection screen.
const AUTH_LOAD_TIMEOUT_MS = 8000;

// Lets native apps start from cached session data when offline (uses SecureStore, so not on web).
const nativeResourceCache = Platform.OS === "web" ? undefined : resourceCache;

const ConnectingScreen = () => (
  <View className="auth-screen items-center justify-center gap-4 px-5">
    <ActivityIndicator color={colors.accent} size="large" />
    <Text className="auth-title text-center">Connecting…</Text>
    <Text className="auth-subtitle">
      This is taking longer than usual. Check your internet connection.
    </Text>
  </View>
);

const RootNavigator = ({ fontsReady }: { fontsReady: boolean }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const [authTimedOut, setAuthTimedOut] = useState(false);
  const isReady = fontsReady && isLoaded;

  useEffect(() => {
    if (!fontsReady || isLoaded) return;
    const timer = setTimeout(() => setAuthTimedOut(true), AUTH_LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [fontsReady, isLoaded]);

  // Wait for the session too, so signed-in users never see the sign-in screen flash.
  useEffect(() => {
    if (isReady || authTimedOut) {
      SplashScreen.hideAsync();
    }
  }, [isReady, authTimedOut]);

  if (!isReady) return authTimedOut && fontsReady ? <ConnectingScreen /> : null;

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
  // Keys must match the --font-* families in global.css.
  const [fontsLoaded, fontError] = useFonts({
    "sans-light": require("../../assets/fonts/PlusJakartaSans-Light.ttf"),
    "sans-regular": require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-medium": require("../../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-bold": require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-extrabold": require("../../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });

  // If a font fails to load, fall back to the system font instead of hanging on the splash.
  const fontsReady = fontsLoaded || !!fontError;

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
      __experimental_resourceCache={nativeResourceCache}
    >
      <RootNavigator fontsReady={fontsReady} />
    </ClerkProvider>
  );
}
