import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";
import React from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
const HomePage = () => {
  //   const handleOnScroll = (useAnimatedStyle = () => {});
  return (
    <SafeAreaView className="bg-[#07091F] h-full">
      <View>
        <Text className="text-white font-bold text-2xl text-center">
          My Studio
        </Text>
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          keyExtractor={(index) => index.toString()}
          renderItem={(item) => (
            <Animated.View className="flex  relative items-center ">
              <View className="w-20 h-20 flex items-center justify-center rounded-full border border-white/70">
                <Image
                  source={require("@/assets/picture.png")}
                  className="object-contain relative w-12 h-12  "
                />
              </View>
              <Text className="text-white mt-2">Bruh</Text>
            </Animated.View>
          )}
          ItemSeparatorComponent={() => <View className="w-5" />}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        <StatusBar barStyle="light-content" backgroundColor={"#07091F"} />
      </View>
    </SafeAreaView>
  );
};

export default HomePage;
