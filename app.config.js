export default {
  expo: {
    plugins: [
      [
        "expo-notifications",
        {
          icon: "./assets/icon.png",
          color: "#ffffff",
        },
      ],
    ],
    name: "Barbershop",
    displayName: "Barbershop",
    slug: "barbershop",
    version: "1.0.0",
    assetBundlePatterns: ["**/*"],
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    android: {
      googleServicesFile: "./google-services.json",
    },
  },
};
