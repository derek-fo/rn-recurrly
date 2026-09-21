import { View, Text } from "react-native";
import { Link } from "expo-router";

const SignIn = () => {
  return (
    <View>
      <Text>Sign In</Text>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 rounded justify-center items-center bg-primary text-white py-4"
      >
        Create account
      </Link>
      <Link href="/" className="mt-4 rounded bg-primary text-white p-4">
        Go Back
      </Link>
    </View>
  );
};

export default SignIn;
