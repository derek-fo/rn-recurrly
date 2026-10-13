import { useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { useSignUp } from "@clerk/expo";
import AuthScreen from "../../../components/auth/AuthScreen";
import AuthField from "../../../components/auth/AuthField";
import AuthButton from "../../../components/auth/AuthButton";
import AuthCodeStep from "../../../components/auth/AuthCodeStep";
import { PENDING_SESSION_MESSAGE, useAuthRedirect } from "../../../lib/auth";
import {
  MIN_PASSWORD_LENGTH,
  getErrorMessage,
  normalizeEmail,
  validateCode,
  validateEmail,
  validatePassword,
} from "../../../lib/validation";

type Step = "details" | "verify";

const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";
const INCOMPLETE_SIGN_UP_MESSAGE =
  "We couldn't finish setting up your account. Please try again.";

const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const passwordRef = useRef<TextInput>(null);

  const [step, setStep] = useState<Step>("details");
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
    serverError(getErrorMessage(errors.fields.emailAddress));
  const passwordError =
    (submitted ? validatePassword(password, { requireStrength: true }) : undefined) ??
    serverError(getErrorMessage(errors.fields.password));
  const codeError =
    (codeSubmitted ? validateCode(code) : undefined) ??
    serverError(getErrorMessage(errors.fields.code));
  const hasFieldError = !!(errors.fields.emailAddress || errors.fields.password);
  const bannerError =
    formError ??
    serverError(
      getErrorMessage(errors.fields.captcha) ??
        getErrorMessage(errors.global?.[0]) ??
        (hasFieldError ? undefined : requestError),
    );

  const clearFeedback = () => {
    setShowServerErrors(false);
    setFormError(undefined);
    setRequestError(undefined);
  };

  const sendEmailCode = async () => {
    const { error } = await signUp.verifications.sendEmailCode();
    setShowServerErrors(true);
    return !error;
  };

  const handleSubmit = async () => {
    if (isFetching) return;
    setSubmitted(true);
    clearFeedback();
    if (validateEmail(email) || validatePassword(password, { requireStrength: true })) return;

    const { error } = await signUp.password({
      emailAddress: normalizeEmail(email),
      password,
    });
    setShowServerErrors(true);

    if (error) {
      setRequestError(error.longMessage ?? GENERIC_ERROR_MESSAGE);
      return;
    }

    if (await sendEmailCode()) {
      setCode("");
      setCodeSubmitted(false);
      setShowServerErrors(false);
      setStep("verify");
    }
  };

  const handleVerify = async () => {
    if (isFetching) return;
    setCodeSubmitted(true);
    clearFeedback();
    if (validateCode(code)) return;

    const { error } = await signUp.verifications.verifyEmailCode({ code });
    setShowServerErrors(true);
    if (error) return;

    if (signUp.status === "complete") {
      await signUp.finalize({ navigate: redirect });
    } else {
      setFormError(INCOMPLETE_SIGN_UP_MESSAGE);
    }
  };

  const handleBack = () => {
    clearFeedback();
    setCode("");
    setStep("details");
  };

  if (step === "verify") {
    return (
      <AuthScreen
        title="Verify your email"
        subtitle="One quick step to secure your account and start tracking renewals."
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
          onResend={sendEmailCode}
          onBack={handleBack}
          submitLabel="Verify and get started"
          backLabel="Change email address"
        />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title="Create your account"
      subtitle="Track every subscription and never miss a renewal again"
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
          placeholder="Create a password"
          secureToggle
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
          error={passwordError}
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
        />

        <AuthButton title="Create account" onPress={handleSubmit} loading={isFetching} />

        <Text className="auth-helper text-center">
          We'll email you a code to confirm it's really you.
        </Text>
      </View>

      <View className="auth-link-row">
        <Text className="auth-link-copy">Already have an account?</Text>
        <Link href="/sign-in" replace className="auth-link">
          Sign in
        </Link>
      </View>

      {/* Bot-protection mount point; only used on web, skipped on iOS and Android. */}
      <View nativeID="clerk-captcha" />
    </AuthScreen>
  );
};

export default SignUp;
