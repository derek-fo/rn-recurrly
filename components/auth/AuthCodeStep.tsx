import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import clsx from "clsx";
import AuthField from "./AuthField";
import AuthButton from "./AuthButton";
import { CODE_LENGTH } from "../../lib/validation";

const RESEND_COOLDOWN_SECONDS = 30;

const AuthCodeStep = ({
  email,
  code,
  onChangeCode,
  error,
  loading,
  onSubmit,
  onResend,
  onBack,
  submitLabel,
  backLabel,
}: AuthCodeStepProps) => {
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    const sent = await onResend();
    if (sent) {
      setResent(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    }
  };

  return (
    <View className="auth-form">
      <Text className="auth-helper">
        We sent a {CODE_LENGTH}-digit code to{" "}
        <Text className="auth-email-highlight">{email}</Text>.
      </Text>

      <AuthField
        label="Verification code"
        value={code}
        onChangeText={(value) => onChangeCode(value.replace(/\D/g, "").slice(0, CODE_LENGTH))}
        placeholder="000000"
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={CODE_LENGTH}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        error={error}
        className="auth-code-input"
      />

      <AuthButton
        title={submitLabel}
        onPress={onSubmit}
        loading={loading}
        disabled={code.length < CODE_LENGTH}
      />

      <View className="auth-resend-row">
        <Text className="auth-link-copy">
          {resent ? "New code sent." : "Didn't get it?"}
        </Text>
        <Pressable
          onPress={handleResend}
          disabled={cooldown > 0 || loading}
          accessibilityRole="button"
          hitSlop={8}
        >
          <Text className={clsx("auth-link", cooldown > 0 && "auth-link-disabled")}>
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </Text>
        </Pressable>
      </View>

      <Pressable
        className="auth-secondary-button"
        onPress={onBack}
        accessibilityRole="button"
      >
        <Text className="auth-secondary-button-text">{backLabel}</Text>
      </Pressable>
    </View>
  );
};

export default AuthCodeStep;
