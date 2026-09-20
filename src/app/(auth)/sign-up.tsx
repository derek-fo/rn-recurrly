import { View, Text } from 'react-native'
import { Link } from 'expo-router'

const SignUp = () => {
  return (
    <View>
        <Text>Sign Up</Text>
        <Link href="/(auth)/sign-in" className="mt-4 rounded justify-center items-center bg-primary text-white py-4">Already have an account? Sign In</Link>
    </View>
  )
}

export default SignUp