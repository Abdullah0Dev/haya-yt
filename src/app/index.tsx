import {
  View,
  Text,
  Image,
  StatusBar,
  Platform,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

const WelcomePage = () => {
  return (
    <>
      <LinearGradient
        // className="flex flex-1 h-full"
        style={{
          flex: 1,
        }}
        // Background Linear Gradient
        colors={["#1F2159", "#1A1A38"]}
      >
        <Image
          source={require("@/assets/welcome-img.png")}
          className={`w-full rotate-4 ${
            Platform.OS === "ios" && "mt-14"
          }  h-[450px] object-contain`}
          resizeMode="contain"
        />

        {/* hook */}
        <Text className="text-white text-3xl px-9">
          Protect your images online, Press once protect anywhere
        </Text>
        {/* sub texts */}
        <Text className="text-white text-base mt-6 px-9">
          it's time to protect your images online, easily with a few clicks you
          can protect your image privacy and hide sensitive area
        </Text>
        <View className="flex absolute bottom-6 w-full flex-row justify-between px-9 items-center">
          <View className="flex flex-row gap-x-1">
            <View className="h-4 w-8 bg-green-300 rounded-full" />
            <View className="h-4 w-4 bg-white rounded-full" />
          </View>
          <TouchableOpacity
            onPress={() => router.push("/home")}
            className="w-16 h-16 flex items-center justify-center rounded-2xl bg-green-400"  
          >
            <Feather
              style={{ alignSelf: "center", fontSize: 32 }}
              name="arrow-up-right"
              // size={24}
              color="#00120D"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <StatusBar barStyle="light-content" backgroundColor={"#1F2159"} />
    </>
  );
};

export default WelcomePage;
