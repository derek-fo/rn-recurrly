import PostHog from "posthog-react-native";

const projectToken = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;

const requirePostHogConfig = (value: string | undefined, variableName: string) => {
  if (!value && __DEV__) {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }
};

requirePostHogConfig(projectToken, "EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN");
requirePostHogConfig(host, "EXPO_PUBLIC_POSTHOG_HOST");

const isPostHogConfigured = Boolean(projectToken && host);

export const posthog = isPostHogConfigured
  ? new PostHog(projectToken!, {
      host: host!,
      captureAppLifecycleEvents: true,
      errorTracking: {
        autocapture: {
          uncaughtExceptions: true,
          unhandledRejections: true,
        },
      },
      logs: {
        serviceName: "rn-recurrly",
      },
    })
  : undefined;

// Verbose SDK logging in development only.
if (__DEV__) posthog?.debug();
