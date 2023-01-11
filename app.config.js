import "dotenv/config";

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
    extra: {
      eas: {
        projectId: "728d160a-064d-463c-8eca-c81df30dc772",
      },
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      BASE_URL: process.env.BASE_URL,
      BASE_URL_2: process.env.BASE_URL_2,
      BASE_URL_3: process.env.BASE_URL_3,
      PUSH_NOTIFICATION_URL: process.env.PUSH_NOTIFICATION_URL,
    },
    android: {
      googleServicesFile:
        process.env.GOOGLE_SERVICES ??
        "./android/app/google-services.json",
    },
  },
};
