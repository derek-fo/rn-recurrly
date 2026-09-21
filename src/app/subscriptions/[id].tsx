import { View, Text } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'

const SubscriptionDetails = () => {
    const { id } = useLocalSearchParams<{id: string}>()
  return (
    <View>
      <Text>Subscription Details: {id} </Text>
      <Link href="/" className="mt-4 rounded bg-primary text-white p-4">Go Back</Link>
    </View>
  )
}

export default SubscriptionDetails