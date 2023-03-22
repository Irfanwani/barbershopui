import { useTheme } from "@react-navigation/native";
import { Linking, View } from "react-native";
import { Button, Divider, Text } from "react-native-paper";

export const CustomAlert = () => {
  const installApp = async () => {
    await Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.servicebarbershop"
    );
  };
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme.colors.bgcolor }}>
      <Text style={{ color: "white" }}>
        Seems you are trying to login using a Service Provider Account on
        barbershop Client App. Please Install the barbershop Services App to
        continue or use a client account to continue on this App.
      </Text>
      <Divider />

      <Button
        mode="contained"
        color="teal"
        style={{ marginTop: 5 }}
        onPress={installApp}
      >
        Get Service App
      </Button>
    </View>
  );
};
