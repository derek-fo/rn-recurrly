import type { ImageSourcePropType } from "react-native";

declare global {
    interface AppTab {
        name: string;
        title: string;
        icon: ImageSourcePropType;
    }

    interface TabIconProps {
        focused: boolean;
        icon: ImageSourcePropType;
    }

    interface Subscription {
        id: string;
        icon: ImageSourcePropType;
        name: string;
        plan?: string;
        category?: string;
        paymentMethod?: string;
        status?: string;
        startDate?: string;
        price: number;
        currency?: string;
        billing: string;
        frequency?: "Monthly" | "Yearly";
        renewalDate?: string;
        color?: string;
    }

    interface SubscriptionCardProps extends Omit<Subscription, "id"> {
        expanded: boolean;
        onPress: () => void;
        onCancelPress?: () => void;
        isCancelling?: boolean;
    }

    interface CreateSubscriptionModalProps {
        visible: boolean;
        onClose: () => void;
        onCreate: (subscription: Subscription) => void;
    }

    interface SubscriptionIconProps {
        source: ImageSourcePropType;
    }

    interface SubscriptionsContextValue {
        subscriptions: Subscription[];
        addSubscription: (subscription: Subscription) => void;
    }

    interface UpcomingSubscription {
        id: string;
        icon: ImageSourcePropType;
        name: string;
        price: number;
        currency?: string;
        daysLeft: number;
    }

    interface UpcomingSubscriptionCardProps
        extends Omit<UpcomingSubscription, "id"> {}

    interface ListHeadingProps {
        title: string;
    }

    interface AuthScreenProps {
        title: string;
        subtitle: React.ReactNode;
        children: React.ReactNode;
    }

    interface AuthFieldProps extends React.ComponentProps<typeof import("react-native").TextInput> {
        label: string;
        error?: string;
        hint?: string;
        secureToggle?: boolean;
        ref?: React.Ref<import("react-native").TextInput>;
    }

    interface AuthButtonProps {
        title: string;
        onPress: () => void;
        loading?: boolean;
        disabled?: boolean;
    }

    interface AuthCodeStepProps {
        email: string;
        code: string;
        onChangeCode: (code: string) => void;
        error?: string;
        loading: boolean;
        onSubmit: () => void;
        onResend: () => Promise<boolean>;
        onBack: () => void;
        submitLabel: string;
        backLabel: string;
    }
}

export {};