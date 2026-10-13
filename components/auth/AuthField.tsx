import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import clsx from "clsx";
import { colors } from "../../constants/theme";

const AuthField = ({
  label,
  error,
  hint,
  secureToggle,
  className,
  onFocus,
  onBlur,
  ref,
  ...inputProps
}: AuthFieldProps) => {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View className="auth-field">
      <Text className="auth-label">{label}</Text>

      <View
        className={clsx(
          "auth-input-row",
          focused && "auth-input-focused",
          error && "auth-input-error",
        )}
      >
        <TextInput
          {...inputProps}
          ref={ref}
          className={clsx("auth-input-bare", className)}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry={secureToggle ? hidden : inputProps.secureTextEntry}
          accessibilityLabel={label}
          aria-invalid={!!error}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
        />

        {secureToggle && (
          <Pressable
            className="auth-input-toggle"
            onPress={() => setHidden((current) => !current)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            hitSlop={8}
          >
            <Text className="auth-input-toggle-text">{hidden ? "Show" : "Hide"}</Text>
          </Pressable>
        )}
      </View>

      {error ? (
        <Text className="auth-error" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : (
        hint && <Text className="auth-helper">{hint}</Text>
      )}
    </View>
  );
};

export default AuthField;
