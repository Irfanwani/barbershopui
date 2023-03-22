import {
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";

export const galleryImageAsync = async () => {
  let { status } = await requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    alert("Media library permissions denied!");
    return null;
  }
  let image = await launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
  });

  if (!image.canceled) {
    return image.assets[0].uri;
  }
  return null;
};

export const cameraImageAsync = async () => {
  let { status } = await requestCameraPermissionsAsync();

  if (status !== "granted") {
    alert("Camera permissions denied!");
    return null;
  }
  let image = await launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
  });

  if (!image.canceled) {
    return image.assets[0].uri;
  }
  return null;
};
