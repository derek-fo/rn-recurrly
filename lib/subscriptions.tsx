import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { HOME_SUBSCRIPTIONS } from "../constants/data";

const SubscriptionsContext = createContext<SubscriptionsContextValue | null>(null);

// Shared in-memory list so a subscription created on Home also shows on the
// Subscriptions tab. Seeded from the dummy data; not persisted across restarts.
export const SubscriptionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(HOME_SUBSCRIPTIONS);

  const addSubscription = useCallback((subscription: Subscription) => {
    setSubscriptions((current) => [subscription, ...current]);
  }, []);

  const value = useMemo(
    () => ({ subscriptions, addSubscription }),
    [subscriptions, addSubscription],
  );

  return <SubscriptionsContext value={value}>{children}</SubscriptionsContext>;
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionsContext);
  if (!context) {
    throw new Error("useSubscriptions must be used within a SubscriptionsProvider");
  }
  return context;
};
