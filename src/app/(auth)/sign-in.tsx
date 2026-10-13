import { useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { useSignIn } from "@clerk/expo";
import AuthScreen from "../../../components/auth/AuthScreen";
import AuthField from "../../../components/auth/AuthField";
import AuthButton from "../../../components/auth/AuthButton";
import AuthCodeStep from "../../../components/auth/AuthCodeStep";
import { PENDING_SESSION_MESSAGE, useAuthRedirect } from "../../../lib/auth";
import {
  getErrorMessage,
  normalizeEmail,
  validateCode,
  validateEmail,
  validatePassword,
} from "../../../lib/validation";

type Step = "credentials" | "verify";

const UNSUPPORTED_FACTOR_MESSAGE =
  "This account uses a verification method that isn't available in the app yet.";
const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const passwordRef = useRef<TextInput>(null);

  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [showServerErrors, setShowServerErrors] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [requestError, setRequestError] = useState<string>();

  const isFetching = fetchStatus === "fetching";
  const redirect = useAuthRedirect(() => setFormError(PENDING_SESSION_MESSAGE));

  const serverError = <T,>(value: T) => (showServerErrors ? value : undefined);

  const emailError =
    (submitted ? validateEmail(email) : undefined) ??
    serverError(getErrorMessage(errors.fields.identifier));
  const passwordError =
    (submitted ? validatePassword(password) : undefined) ??
    serverError(getErrorMessage(errors.fields.password));
  const codeError =
    (codeSubmitted ? validateCode(code) : undefined) ??
    serverError(getErrorMessage(errors.fields.code));
  const hasFieldError = !!(errors.fields.identifier || errors.fields.password);
  const bannerError =
    formError ??
    serverError(
      getErrorMessage(errors.global?.[0]) ?? (hasFieldError ? undefined : requestError),
    );

  const clearFeedback = () => {
    setShowServerErrors(false);
    setFormError(undefined);
    setRequestError(undefined);
  };

  const sendDeviceCode = async () => {
    const { error } = await signIn.mfa.sendEmailCode();
    setShowServerErrors(true);
    return !error;
  };

  const handleSubmit = async () => {
    if (isFetching) return;
    setSubmitted(true);
    clearFeedback();
    if (validateEmail(email) || validatePassword(password)) return;

    const { error } = await signIn.password({
      emailAddress: normalizeEmail(email),
      password,
    });
    setShowServerErrors(true);

    if (error) {
      setRequestError(error.longMessage ?? GENERIC_ERROR_MESSAGE);
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: redirect });
      return;
    }

    // New device or second factor: confirm with an emailed code.
    if (signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor") {
      const canUseEmailCode = signIn.supportedSecondFactors.some(
        (factor) => factor.strategy === "email_code",
      );

      if (!canUseEmailCode) {
        setFormError(UNSUPPORTED_FACTOR_MESSAGE);
        return;
      }

      if (await sendDeviceCode()) {
        setCode("");
        setCodeSubmitted(false);
        setShowServerErrors(false);
        setStep("verify");
      }
      return;
    }

    setFormError(GENERIC_ERROR_MESSAGE);
  };

  const handleVerify = async () => {
    if (isFetching) return;
    setCodeSubmitted(true);
    clearFeedback();
    if (validateCode(code)) return;

    const { error } = await signIn.mfa.verifyEmailCode({ code });
    setShowServerErrors(true);
    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: redirect });
    } else {
      setFormError(GENERIC_ERROR_MESSAGE);
    }
  };

  const handleBack = async () => {
    await signIn.reset();
    clearFeedback();
    setCode("");
    setPassword("");
    setSubmitted(false);
    setStep("credentials");
  };

  if (step === "verify") {
    return (
      <AuthScreen
        title="Confirm it's you"
        subtitle="For your security, we verify new devices before showing your billing details."
      >
        {bannerError && (
          <View className="auth-banner mb-4">
            <Text className="auth-banner-text">{bannerError}</Text>
          </View>
        )}
        <AuthCodeStep
          email={normalizeEmail(email)}
          code={code}
          onChangeCode={(value) => {
            setCode(value);
            clearFeedback();
          }}
          error={codeError}
          loading={isFetching}
          onSubmit={handleVerify}
          onResend={sendDeviceCode}
          onBack={handleBack}
          submitLabel="Verify and continue"
          backLabel="Use a different account"
        />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in to continue managing your subscriptions"
    >
      <View className="auth-form">
        {bannerError && (
          <View className="auth-banner">
            <Text className="auth-banner-text">{bannerError}</Text>
          </View>
        )}

        <AuthField
          label="Email"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            clearFeedback();
          }}
          placeholder="Enter your email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
          error={emailError}
        />

        <AuthField
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            clearFeedback();
          }}
          placeholder="Enter your password"
          secureToggle
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          autoComplete="current-password"
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
          error={passwordError}
        />

        <AuthButton title="Sign in" onPress={handleSubmit} loading={isFetching} />
      </View>

      <View className="auth-link-row">
        <Text className="auth-link-copy">New to Recurly?</Text>
        <Link href="/sign-up" replace className="auth-link">
          Create an account
        </Link>
      </View>
    </AuthScreen>
  );
};

export default SignIn;
