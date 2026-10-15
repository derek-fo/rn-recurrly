import { View, Text } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { posthog } from '../../lib/posthog'

const SubscriptionDetails = () => {
    const { id } = useLocalSearchParams<{id: string}>()

    useEffect(() => {
      if (id) posthog?.capture('subscription_details_viewed', { subscription_id: id })
    }, [id])

  return (
    <View>
      <Text>Subscription Details: {id} </Text>
      <Link href="/" className="mt-4 rounded bg-primary text-white p-4">Go Back</Link>
    </View>
  )
}

export default SubscriptionDetails