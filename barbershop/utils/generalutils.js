import Share from "react-native-share";

const options = {
  title: "Barbershop Services App",
  message:
    "Download the barbershop services app from playstore for free to connect with new clients and manage your appoinments.",
  url: "https://play.google.com/store/apps/details?id=com.servicebarbershop",
};

export const shareApp = async () => {
  try {
    await Share.open(options);
  } catch {}
};
