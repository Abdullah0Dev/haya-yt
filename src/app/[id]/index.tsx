import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import Toast from "react-native-toast-message";
import { Fontisto, MaterialIcons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing"; // Import the library
import { StatusBar } from "expo-status-bar";

const ImageDetails = () => {
  const { image } = useLocalSearchParams();
  const [imageUri, setImageUri] = useState<string | null>("");
const ANDROID_DEVICE = Platform.OS === "android"
  // load image
  // Download the HTTPS image to the app's local file system
  useEffect(() => {
    const loadImage = async () => {
      try {
        console.log("image:", image);

        const imageUrl = image; // Use your actual URL here
        const fileUri = `${FileSystem.documentDirectory}downloadedImage.jpg`;

        const { uri } = await FileSystem.downloadAsync(
          imageUrl as string,
          fileUri
        );

        if (!uri) {
          throw new Error("Download failed. No URI received.");
        }
        setImageUri(uri); // Set the downloaded file URI

        console.log("Image loaded successfully:", uri);
      } catch (error) {
        console.error("Error loading image:", error);
        Toast.show({
          type: "error",
          text1: "Load Image Error",
          text2: "Unable to Load the image.",
        });
      }
    };

    loadImage();
  }, [image]);

  // Save the downloaded image to the device's media library
  const saveImage = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permission Denied",
          text2: "You need to grant storage permissions to save the image.",
        });
        return;
      }

      if (imageUri) {
        await MediaLibrary.saveToLibraryAsync(imageUri);
        console.log("Image successfully saved");

        Toast.show({
          type: "success",
          text1: "Success!",
          text2: "Image saved successfully 🎉",
        });
      } else {
        console.error("No image URI found!");
      }
    } catch (error) {
      console.error("Error saving image:", error);
      Toast.show({
        type: "error",
        text1: "Save Error",
        text2: "Unable to save the image.",
      });
    }
  };

  const handleDownloadImage = async () => {
    await saveImage();
  };
  

  const shareImage = async () => {
    try {
      const message =
        "you can download the app and generate better with your imaginations";
      // if (imageUri) {
      await Sharing.shareAsync(imageUri, {
        dialogTitle: message,
        mimeType: "image/webp",
      });
      // }
    } catch (error) {
      console.log("not working");
    }
  };

  return (
    <View className="h-full bg-[#07091F]">
      <Image
        source={
          image
            ? { uri: image as string }
            : require("@/assets/ai-yt-studio.jpg")
        }
        className="w-full h-[60vh]"
      />
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-9 left-6 bg-black/20 p-3 rounded-full blur"
      >
        <MaterialIcons name={"arrow-back-ios-new"} size={18} color="white" />
      </TouchableOpacity>
      <View className={`flex ${ANDROID_DEVICE ? "mx-5" : "mx-2"}  flex-row justify-center items-center space-x-4 absolute bottom-14`}>
        {/* Share Button */}
        <TouchableOpacity onPress={shareImage} className="w-20 ">
          <LinearGradient
            colors={["#07091F", "#1A2451", "#3945C8"]}
            start={{ x: 0.7, y: 0.2 }}
            end={{ x: 0.1, y: 0.8 }}
            style={{
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              width: 70,
              height: 50,
            }}
          >
            <Fontisto name={"share"} size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Download Button */}
        <TouchableOpacity   onPress={handleDownloadImage} className="flex-grow  ">
          <LinearGradient
            colors={["#07091F", "#1A2451", "#3945C8", "#2631A9"]}
            start={{ x: 0.1, y: 0.2 }}
            end={{ x: 0.7, y: 0.8 }}
            style={{
              borderRadius: 60,
              paddingHorizontal: 12,
              paddingVertical: 17,
            }}
          >
            <Text className="text-white text-xl font-bold text-center">
              Download
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <StatusBar style="inverted" />
      <Toast />
    </View>
  );
};

export default ImageDetails;
