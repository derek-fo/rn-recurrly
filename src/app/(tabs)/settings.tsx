import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Image } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { useClerk, useUser } from "@clerk/expo";
import clsx from "clsx";
import dayjs from "dayjs";
import images from "../../../constants/images";
import { colors } from "../../../constants/theme";
import { posthog } from "../../lib/posthog";
import { posthogLogs } from "../../lib/posthog-logs";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string>();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError(undefined);
    try {
      // The root layout's protected routes send the user back to sign-in.
      await signOut();
      posthog?.capture("user_signed_out");
      posthogLogs.signOutCompleted();
    } catch {
      posthogLogs.signOutFailed();
      setSignOutError("Couldn't sign you out. Check your connection and try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const email = user?.primaryEmailAddress?.emailAddress;
  const displayName = user?.fullName ?? user?.firstName ?? email?.split("@")[0] ?? "User";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="list-title my-5">Settings</Text>

      <View className="sub-card bg-card mb-5">
        <View className="flex-row items-center gap-4">
          <Image
            source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
            className="size-16 rounded-full"
          />
          <View className="flex-1">
            <Text className="sub-title" numberOfLines={1}>
              {displayName}
            </Text>
            {email && (
              <Text className="sub-meta" numberOfLines={1} ellipsizeMode="tail">
                {email}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View className="sub-card bg-card">
        <Text className="sub-title mb-3">Account</Text>
        <View className="sub-details">
          <View className="sub-row">
            <View className="sub-row-copy">
              <Text className="sub-label">Account ID</Text>
              <Text className="sub-value" numberOfLines={1} ellipsizeMode="middle">
                {user?.id ?? "Not provided"}
              </Text>
            </View>
          </View>
          <View className="sub-row">
            <View className="sub-row-copy">
              <Text className="sub-label">Joined</Text>
              <Text className="sub-value" numberOfLines={1}>
                {user?.createdAt ? dayjs(user.createdAt).format("DD/MM/YYYY") : "Not provided"}
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

        {signOutError && <Text className="auth-error mt-3 text-center">{signOutError}</Text>}
      </View>
    </SafeAreaView>
  );
};

export default Settings;
