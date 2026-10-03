import "../../../global.css";
import { Text, Image, View, FlatList } from "react-native";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import {
  HOME_BALANCE,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "../../../constants/data";
import images from "../../../constants/images";
import { icons } from "../../../constants/icons";
import { formatCurrency } from "../../../lib/utils";
import dayjs from "dayjs";
import ListHeading from "../../../components/ListHeading";
import UpcomingSubscription from "../../../components/UpcomingSubscription";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="home-header">
        <View className="home-user">
          <Image source={images.avatar} className="home-avatar" />
          <Text className="home-user-name">{HOME_USER.name}</Text>
        </View>

        <Image source={icons.add} className="home-add-icon" />
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

      <View className="home-subscriptions">
        <ListHeading title="Upcoming" />

        <FlatList
          data={UPCOMING_SUBSCRIPTIONS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <UpcomingSubscription {...item} />}
        />
      </View>

      <View>
        <ListHeading title="All Subscriptions" />
      </View>
    </SafeAreaView>
  );
}
