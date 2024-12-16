import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
const HomePage = () => {
  const [selectedItem, setSelectedItem] = useState("Gallery");
  const scrollX = useSharedValue(0);
  const handleScrollX = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });
  const { width } = Dimensions.get("screen");
  const ITEM_WIDTH = width / 3;
  const REDUCED_WIDTH = ITEM_WIDTH * 0.6;
  const SPACING = (width - REDUCED_WIDTH) / 2;
  const AnimatedImageItem = ({
    index,
    item,
  }: {
    index: number;
    item: ActionsDataType;
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * REDUCED_WIDTH,
        (index - 0.5) * REDUCED_WIDTH,
        index * REDUCED_WIDTH,
        (index + 0.5) * REDUCED_WIDTH,
        (index + 1) * REDUCED_WIDTH,
      ];
      const outputRange = [-30, -10, 0, -10, -30]; // circle
      const translateY = interpolate(scrollX.value, inputRange, outputRange);
      return {
        transform: [{ translateY }],
      };
    });
    const url = "../../assets/picture.png";
    console.log(item.image, url);
    const AnimatedTouchableOpacity =
      Animated.createAnimatedComponent(TouchableOpacity);
    const handleSelectItem = (item: string) => {
      setSelectedItem(item);
    };
    return (
      <AnimatedTouchableOpacity
        onPress={() => handleSelectItem(item.title)}
        style={[{ width: REDUCED_WIDTH }, animatedStyle]}
        className="flex  relative items-center  "
      >
        <View className=" flex items-center w-20 h-20 justify-center rounded-full border border-white/70">
          <Image
            source={IMAGES[item.image]}
            className="object-contain relative w-12 h-12  "
          />
        </View>
        <Text
          className={`te mt-2 ${
            item.title === selectedItem ? "text-cyan-200" : "text-white/50"
          } `}
        >
          {item.title}
        </Text>
      </AnimatedTouchableOpacity>
    );
  };
  return (
    <SafeAreaView className="bg-[#07091F] h-full">
      <View>
        <Text className="text-white font-bold text-2xl text-center">
          My Studio
        </Text>
        {/* action items */}
        <Animated.FlatList
          data={ActionsData}
          keyExtractor={({ title }) => title.toString()}
          renderItem={({ item, index }) => (
            <AnimatedImageItem item={item} index={index} />
          )}
          horizontal
          onScroll={handleScrollX}
          contentContainerStyle={{
            paddingHorizontal: SPACING,
            paddingTop: 75,
            alignItems: "center",
          }}
          snapToInterval={REDUCED_WIDTH}
          decelerationRate="fast"
          scrollEventThrottle={16}
          initialScrollIndex={2}
          getItemLayout={(_, index) => ({
            length: REDUCED_WIDTH,
            offset: REDUCED_WIDTH * index,
            index,
          })}
          showsHorizontalScrollIndicator={false}
        />
        {/* images */}
        <View>
          <View className="h-px w-full bg-slate-100 mt-3 rounded" />
          <Animated.FlatList
            data={[1, 2, 3, 4, 5, 6]}
            keyExtractor={(index) => index.toString()}
            renderItem={({ item, index }) => (
              <Image
                source={require("@/assets/coder.jpg")}
                className="w-1/2 h-52"
              />
            )}
            contentContainerStyle={{
              alignItems: "center",
            }}
            // snapToInterval={REDUCED_WIDTH}
            decelerationRate="fast"
            numColumns={2}
            // scrollEventThrottle={16}
            // initialScrollIndex={2}
            // getItemLayout={(_, index) => ({
            //   length: REDUCED_WIDTH,
            //   offset: REDUCED_WIDTH * index,
            //   index,
            // })}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <StatusBar barStyle="light-content" backgroundColor={"#07091F"} />
      </View>
    </SafeAreaView>
  );
};

export default HomePage;

interface ActionsDataType {
  image: string;
  title: string;
}

const IMAGES = {
  Albums: require("../../assets/folder.png"),
  Videos: require("../../assets/video.png"),
  Gallery: require("../../assets/picture.png"),
  Favorites: require("../../assets/add-to-favorites.png"),
  Photo: require("../../assets/photo-gallery.png"),
};
const ActionsData: ActionsDataType[] = [
  {
    image: "Albums",
    title: "Albums",
  },
  {
    image: "Videos",
    title: "Videos",
  },
  {
    image: "Gallery",
    title: "Gallery",
  },
  {
    image: "Favorites",
    title: "Favorites",
  },
  {
    image: "Photo",
    title: "Add",
  },
];
