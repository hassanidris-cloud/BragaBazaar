import React, { useCallback, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Colors, FontSize, Radius, Spacing } from "../theme";
import { useI18n } from "../i18n";

type SlideToConfirmProps = {
  onComplete: () => void;
};

export function SlideToConfirm({ onComplete }: SlideToConfirmProps) {
  const translateX = useSharedValue(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const { t } = useI18n();

  const handleComplete = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onComplete();
  }, [onComplete]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const maxX = Math.max(trackWidth - 72, 0);
      translateX.value = Math.min(Math.max(event.translationX, 0), maxX);
    })
    .onEnd(() => {
      const maxX = Math.max(trackWidth - 72, 0);
      if (translateX.value >= maxX * 0.9) {
        translateX.value = withSpring(maxX, { damping: 16 });
        runOnJS(handleComplete)();
      } else {
        translateX.value = withSpring(0, { damping: 16 });
      }
    });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      style={styles.track}
    >
      <View style={styles.labelWrap}>
        <Text style={styles.label}>{t.slideToConfirm}</Text>
      </View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.knob, knobStyle]}>
          <Text style={styles.knobText}>{t.pay}</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    marginTop: Spacing.lg,
    height: 56,
    width: "100%",
    borderRadius: Radius.full,
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#C8E6C9",
    paddingHorizontal: 4,
    justifyContent: "center",
  },
  labelWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: "500",
  },
  knob: {
    height: 48,
    width: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  knobText: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.textOnPrimary,
  },
});
