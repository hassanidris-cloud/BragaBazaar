import React, { useState } from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { Colors, Radius } from "../theme";

type LazyImageProps = {
  source: ImageSourcePropType;
  height: number;
  borderRadius?: number;
};

export function LazyImage({ source, height, borderRadius = Radius.sm }: LazyImageProps) {
  const [loading, setLoading] = useState(true);

  return (
    <View style={[styles.container, { height }]}>
      {loading && (
        <View
          style={[StyleSheet.absoluteFill, styles.skeleton, { borderRadius }]}
        />
      )}
      <Image
        source={source}
        style={[styles.image, { height, borderRadius }]}
        resizeMode="contain"
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", position: "relative" },
  skeleton: { backgroundColor: Colors.surfaceAlt },
  image: { width: "100%", borderRadius: Radius.sm },
});
