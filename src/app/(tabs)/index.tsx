import "../../../global.css";
import { Text, Image, View, FlatList, Pressable } from "react-native";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { HOME_BALANCE, HOME_USER } from "../../../constants/data";
import images from "../../../constants/images";
import { icons } from "../../../constants/icons";
import { formatCurrency } from "../../../lib/utils";
import dayjs from "dayjs";
import ListHeading from "../../../components/ListHeading";
import UpcomingSubscription from "../../../components/UpcomingSubscription";
import SubscriptionCard from "../../../components/SubscriptionCard";
import CreateSubscriptionModal from "../../../components/CreateSubscriptionModal";
import { useMemo, useState } from "react";
import { useSubscriptions } from "../../../lib/subscriptions";
import { useUser } from "@clerk/expo";
import { posthog } from "../../lib/posthog";
import { posthogLogs } from "../../lib/posthog-logs";

const SafeAreaView = styled(RNSafeAreaView);

// Active subscriptions renewing within this many days show in "Upcoming".
const UPCOMING_WINDOW_DAYS = 7;

export default function App() {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const { subscriptions, addSubscription } = useSubscriptions();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const { user } = useUser();
  const displayName =
    user?.firstName ??
    user?.primaryEmailAddress?.emailAddress.split("@")[0] ??
    HOME_USER.name;

  const upcomingSubscriptions = useMemo<UpcomingSubscription[]>(() => {
    const now = dayjs();
    const windowEnd = now.add(UPCOMING_WINDOW_DAYS, "day");
    return subscriptions
      .filter(
        (subscription) =>
          subscription.status === "active" &&
          !!subscription.renewalDate &&
          dayjs(subscription.renewalDate).isAfter(now) &&
          dayjs(subscription.renewalDate).isBefore(windowEnd),
      )
      .sort((a, b) => dayjs(a.renewalDate).diff(dayjs(b.renewalDate)))
      .map((subscription) => ({
        id: subscription.id,
        icon: subscription.icon,
        name: subscription.name,
        price: subscription.price,
        currency: subscription.currency,
        daysLeft: Math.ceil(dayjs(subscription.renewalDate).diff(now, "day", true)),
      }));
  }, [subscriptions]);

  const handleCreateSubscription = (subscription: Subscription) => {
    addSubscription(subscription);
    posthog?.capture("subscription_created", {
      subscription_id: subscription.id,
      subscription_category: subscription.category ?? null,
      subscription_frequency: subscription.frequency ?? null,
      subscription_price: subscription.price,
      subscription_currency: subscription.currency ?? null,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image
                  source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
                  className="home-avatar"
                />
                <Text className="home-user-name">{displayName}</Text>
              </View>

              <Pressable
                onPress={() => setIsCreateModalVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Add subscription"
                hitSlop={8}
              >
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>
            </View>

            <View className="home-balance-card">
              <Text className="label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("DD/MM")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />

              <FlatList
                data={upcomingSubscriptions}
                renderItem={({ item }) => <UpcomingSubscription {...item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">No upcoming renewals yet.</Text>
                }
              />
            </View>

            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => {
              const isExpanding = expandedSubscriptionId !== item.id;
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              );

              if (!isExpanding) {
                posthog?.capture("subscription_details_collapsed", {
                  subscription_id: item.id,
                });
              } else {
                posthog?.capture("subscription_details_expanded", {
                  subscription_id: item.id,
                  subscription_category: item.category,
                  subscription_status: item.status,
                  billing_interval: item.billing,
                });
                posthogLogs.subscriptionDetailsExpanded({
                  id: item.id,
                  category: item.category,
                  status: item.status,
                  billingInterval: item.billing,
                });
              }
            }}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-gray-500">No subscriptions found.</Text>
        }
        contentContainerClassName="pb-30"
      />

      <CreateSubscriptionModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={handleCreateSubscription}
      />
    </SafeAreaView>
  );
}
