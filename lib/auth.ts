import { type Href, useRouter } from "expo-router";

type FinalizeNavigateParams = {
  session?: { currentTask?: unknown } | null;
  decorateUrl: (url: string) => string;
};

export const PENDING_SESSION_MESSAGE =
  "Your account needs one more step before you can continue. Please try again shortly.";

// Builds the `navigate` callback passed to signIn/signUp.finalize().
// The root layout's protected routes also react to the new session, so this only
// needs to move the user to the home screen once the session is fully active.
export const useAuthRedirect = (onPendingTask: () => void) => {
  const router = useRouter();

  return ({ session, decorateUrl }: FinalizeNavigateParams) => {
    if (session?.currentTask) {
      onPendingTask();
      return;
    }

    const url = decorateUrl("/");
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      router.replace(url as Href);
    }
  };
};
