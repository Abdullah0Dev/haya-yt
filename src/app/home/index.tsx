import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useState } from "react";
import mime from "mime";
import { ReactNativeModal } from "react-native-modal";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
const HomePage = () => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [selectedFullImage, setSelectedFullImage] = useState<
    ImagePicker.ImagePickerAsset | undefined
  >(undefined);
  const [loadingResults, setLoadingResults] = useState(false);
  const scrollX = useSharedValue(0);
  const handleScrollX = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });
  const { width } = Dimensions.get("screen");
  const ITEM_WIDTH = width / 3;
  const REDUCED_WIDTH = ITEM_WIDTH * 0.6;
  const SPACING = (width - REDUCED_WIDTH) / 2;

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setSelectedFullImage(result.assets[0]);
    } else {
      Toast.show({
        type: "error",
        text1: "NO Image Selected!",
        text2: "You did not select any image. ❌",
      });
    }
  };
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
    // console.log(item.image, url);
    const AnimatedTouchableOpacity =
      Animated.createAnimatedComponent(TouchableOpacity);

    return (
      <AnimatedTouchableOpacity
        onPress={item.onPress}
        style={[{ width: REDUCED_WIDTH }, animatedStyle]}
        className={`flex  relative items-center   ${
          item.title === "Image" ? "opacity-100" : "opacity-50"
        }`}
      >
        <View className=" flex items-center w-20 h-20 justify-center rounded-full border border-white/70">
          <Image
            source={IMAGES[item.image]}
            className="object-contain relative w-12 h-12  "
          />
        </View>
        <Text
          className={`te mt-2 ${
            item.title === "Image" ? "text-cyan-200" : "text-white/60"
          } `}
        >
          {item.title}
        </Text>
      </AnimatedTouchableOpacity>
    );
  };
  const handleRemoveImage = () => {
    setSelectedImage(undefined);
  };
  // http://localhost:4000/uploads/result_1734928642943.png -> 27.0.0.1
  // https://haya-kw2u.onrender.com/uploads/resuvlt_1734928392943.png
  // http://haya.devmindslab.com/uploads/resuvlt_1734928392943.png
  const handleDetectFace = async () => {
    try {
      const newImageUri =
        "file:///" + selectedFullImage.uri.split("file:/").join("");

      const data = new FormData();
      data.append("image", {
        uri: newImageUri, // Fix for Android
        type: mime.getType(newImageUri),
        name: newImageUri.split("/").pop(),
      });
      setLoadingResults(true);
      const response = await axios.post(
        `http://haya.devmindslab.com/blur-face`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // const gender = response.data.gender[0];
      // const age = response.data.age[0];
      const ImageUrl = response.data.imageUrl;
      console.log("Image Url:", `${ImageUrl}`);
      const finalImageUrl = `${ImageUrl}`;

      router.push({
        pathname: `/${selectedFullImage.fileName}`,
        params: { image: finalImageUrl },
      });
    } catch (error) {
      console.log("Error Accurate", error);
      Toast.show({
        type: "error",
        text1: "Failed to blur face",
        text2: `${error.response?.data?.message || error.message}`,
      });
    } finally {
      setLoadingResults(false);
    }
  };
  const ANDROID_DEVICE = Platform.OS === "android";

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
          scrollEnabled={false}
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
        <View className="h-px w-full bg-slate-100 mt-3 rounded" />
        <View>
          <ReactNativeModal isVisible={loadingResults}>
            <View className="bg-white mx-5 rounded-3xl h-80 flex justify-center items-center">
              {/* <LoadingDots size={35} /> */}
              {/* <ActivityIndicator size={"large"} /> */}
              <LottieView
                autoPlay
                style={{
                  width: 200,
                  height: 200,
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={{
                  uri: `https://lottie.host/c054d34e-b132-4dea-bf21-84fabf24869c/XODPYGKx0m.lottie`,
                }}
              />
              <Text className="text-xl">Detecting Face...</Text>
            </View>
          </ReactNativeModal>
          {selectedImage ? (
            <>
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-[50vh] "
                resizeMode="contain"
              />
              <TouchableOpacity
                accessibilityLabel="Remove image"
                accessibilityRole="button"
                onPress={handleRemoveImage}
                className="absolute top-9 left-6 bg-black/50 p-3 rounded-full blur"
              >
                <Feather name={"x"} size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDetectFace}
                className={` self-center w-full mt-5 ${
                  ANDROID_DEVICE ? "px-5" : "px-2"
                }  `}
              >
                <LinearGradient
                  colors={["#07091F", "#1A2451", "#3945C8", "#2631A9"]}
                  start={{ x: 0.1, y: 0.2 }} // Custom starting point
                  end={{ x: 0.7, y: 0.8 }} // Custom ending point
                  style={{
                    borderRadius: 60,
                    paddingHorizontal: 12,
                    paddingVertical: 17,
                  }}
                >
                  <Text className="text-white text-xl font-bold text-center">
                    {" "}
                    Blur Faces{" "}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              {/* <LoadingDots dots={5} /> */}
            </>
          ) : (
            <View
              className={`flex ${
                ANDROID_DEVICE ? "px-5" : "mx-2"
              } mt-[20vh] items-center justify-center`}
            >
              <Text className="text-white text-xl px-1 text-center">
                📸 Pick an image to get started! Easily secure your photos by
                blurring faces and more exciting tools coming soon! 🚀
              </Text>
              {/* <Button title="Detect Face" onPress={handleDetectFace} /> */}
              <TouchableOpacity
                onPress={pickImageAsync}
                className={` self-center w-full mt-5 `}
              >
                <LinearGradient
                  colors={["#07091F", "#1A2451", "#3945C8", "#2631A9"]}
                  start={{ x: 0.1, y: 0.2 }} // Custom starting point
                  end={{ x: 0.7, y: 0.8 }} // Custom ending point
                  style={{
                    borderRadius: 60,
                    paddingHorizontal: 12,
                    paddingVertical: 17,
                  }}
                >
                  <Text className="text-white text-xl font-bold text-center">
                    {" "}
                    Upload Image{" "}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Toast />
        <StatusBar barStyle="light-content" backgroundColor={"#07091F"} />
      </View>
    </SafeAreaView>
  );
};

export default HomePage;

interface ActionsDataType {
  image: string;
  title: string;
  onPress?: () => void;
}

const IMAGES = {
  Albums: require("../../assets/folder.png"),
  Videos: require("../../assets/video.png"),
  Gallery: require("../../assets/picture.png"),
  RealTime: require("../../assets/real-time.png"),
  Photo: require("../../assets/photo-gallery.png"),
};
const handleShowComingSoon = async () => {
  await Toast.show({
    type: "error",
    text1: "Coming Soon",
    text2: "This feature coming in the next updates inshallah.",
  });
};
const ActionsData: ActionsDataType[] = [
  {
    image: "Albums",
    title: "Albums",
    onPress: handleShowComingSoon,
  },
  {
    image: "Videos",
    title: "Videos",
    onPress: handleShowComingSoon,
  },
  {
    image: "Photo",
    title: "Image",
    onPress: () => {},
  },
  {
    image: "RealTime",
    title: "Real Time",
    onPress: handleShowComingSoon,
  },
  {
    image: "Gallery",
    title: "Gallery",
    onPress: handleShowComingSoon,
  },
];

// render.com: asdfQWER!@#$23
/*
 expo@~52.0.20
  expo-router@~4.0.14
  react-native@0.76.5
*/
