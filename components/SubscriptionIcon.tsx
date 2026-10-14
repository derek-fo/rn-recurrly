import { useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import type { ImageSourcePropType } from "react-native";
import clsx from "clsx";
import { icons } from "../constants/icons";

const isRemote = (source: ImageSourcePropType) =>
  typeof source === "object" && source !== null && "uri" in source;

// expo-image (unlike RN Image) renders the SVG logos served by Simple Icons.
// Falls back to the wallet icon when the CDN has no logo for the name.
const SubscriptionIcon = ({ source }: SubscriptionIconProps) => {
  const [failed, setFailed] = useState(false);
  const remote = isRemote(source) && !failed;

  return (
    <View className={clsx("sub-icon overflow-hidden", remote && "sub-icon-remote")}>
      <Image
        source={failed ? icons.wallet : source}
        style={{ width: "100%", height: "100%" }}
        contentFit="contain"
        onError={() => setFailed(true)}
        accessibilityIgnoresInvertColors
      />
    </View>
  );
};

export default SubscriptionIcon;
