import { ActivityIndicator, Pressable, Text } from "react-native";
import clsx from "clsx";
import { colors } from "../../constants/theme";

const AuthButton = ({ title, onPress, loading, disabled }: AuthButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={clsx("auth-button", isDisabled && "auth-button-disabled")}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Text className="auth-button-text">{title}</Text>
      )}
    </Pressable>
  );
};

export default AuthButton;
