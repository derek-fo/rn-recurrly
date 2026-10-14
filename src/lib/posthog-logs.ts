import { posthog } from "./posthog";

export const posthogLogs = {
  subscriptionDetailsExpanded: (subscription: {
    id: string;
    category: string;
    status: string;
    billingInterval: string;
  }) => {
    posthog?.logger.info("subscription details expanded", {
      subscription_id: subscription.id,
      subscription_category: subscription.category,
      subscription_status: subscription.status,
      billing_interval: subscription.billingInterval,
    });
  },

  signOutCompleted: () => {
    posthog?.logger.info("sign out completed");
  },

  signOutFailed: () => {
    posthog?.logger.warn("sign out failed");
  },
};
