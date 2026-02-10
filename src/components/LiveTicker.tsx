import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Colors, FontSize, Spacing } from "../theme";
import { useI18n } from "../i18n";

export function LiveTicker() {
  const { width } = useWindowDimensions();
  const translateX = useRef(new Animated.Value(width)).current;
  const { t } = useI18n();
  const fullText = [t.ticker1, t.ticker2, t.ticker3, t.ticker4].join("     ·     ");

  useEffect(() => {
    const loop = () => {
      translateX.setValue(width);
      Animated.timing(translateX, {
        toValue: -width * 3,
        duration: 20000,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) loop();
      });
    };
    loop();
    return () => translateX.stopAnimation();
  }, [width, translateX]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.track, { transform: [{ translateX }] }]}>
        <Text style={styles.text}>{fullText}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    overflow: "hidden",
  },
  track: {
    flexDirection: "row",
  },
  text: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.xs,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
