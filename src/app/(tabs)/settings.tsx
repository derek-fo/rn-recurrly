import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { useClerk, useUser } from "@clerk/expo";
import clsx from "clsx";
import { colors } from "../../../constants/theme";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      // The root layout's protected routes send the user back to sign-in.
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="list-title my-5">Settings</Text>

      <View className="sub-card bg-card">
        <View className="sub-details">
          <View className="sub-row">
            <View className="sub-row-copy">
              <Text className="sub-label">Signed in as</Text>
              <Text className="sub-value" numberOfLines={1} ellipsizeMode="tail">
                {user?.primaryEmailAddress?.emailAddress ?? "Not provided"}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          className={clsx("sub-cancel mt-6", isSigningOut && "sub-cancel-disabled")}
          onPress={handleSignOut}
          disabled={isSigningOut}
          accessibilityRole="button"
        >
          {isSigningOut ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text className="sub-cancel-text">Sign out</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
