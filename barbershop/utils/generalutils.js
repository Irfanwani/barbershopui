import Share from "react-native-share";

const options = {
  title: "Barbershop App",
  message:
    "Download the barbershop app from playstore for free to connect with barbers around you and save time by fixing appointments.",
  url: "https://play.google.com/store/apps/details?id=com.barbershop",
};

export const shareApp = async () => {
  try {
    await Share.open(options);
  } catch {}
};
