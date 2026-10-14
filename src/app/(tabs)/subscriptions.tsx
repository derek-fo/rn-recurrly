import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import clsx from "clsx";
import { useSubscriptions } from "../../../lib/subscriptions";
import { colors } from "../../../constants/theme";
import SubscriptionCard from "../../../components/SubscriptionCard";

const SafeAreaView = styled(RNSafeAreaView);

const matchesQuery = (subscription: Subscription, query: string) =>
  [
    subscription.name,
    subscription.category,
    subscription.plan,
    subscription.billing,
    subscription.status,
    subscription.paymentMethod,
  ].some((field) => field?.toLowerCase().includes(query));

const Subscriptions = () => {
  const { subscriptions } = useSubscriptions();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  const filteredSubscriptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return subscriptions;
    return subscriptions.filter((subscription) =>
      matchesQuery(subscription, normalizedQuery),
    );
  }, [query, subscriptions]);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="subs-title">Subscriptions</Text>

      <View className={clsx("subs-search", focused && "subs-search-focused")}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name, category or plan"
          placeholderTextColor={colors.mutedForeground}
          className="subs-search-input"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="never"
          accessibilityLabel="Search subscriptions"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {query.length > 0 && (
          <Pressable
            onPress={() => setQuery("")}
            className="subs-search-clear"
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Text className="subs-search-clear-text">Clear</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <View className="subs-empty">
            <Text className="subs-empty-text">
              {query.trim()
                ? `No subscriptions match "${query.trim()}".`
                : "No subscriptions yet."}
            </Text>
          </View>
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
