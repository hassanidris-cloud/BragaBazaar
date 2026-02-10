import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Colors, FontSize, Radius, Shadow, Spacing } from "../theme";

import {
  createMBWayTransaction,
  MBWayStatus,
  MBWayTransaction,
  startMBWayPolling,
  validatePTMobile,
} from "../services/mbway";
import { useI18n } from "../i18n";

/* ── Props ─────────────────────────────────────────────── */
export type MBWayCheckoutProps = {
  totalAmount: number;
  orderId: string;
  onSuccess: (transactionId: string) => void;
  onBack: () => void;
};

const MBWAY_TIMEOUT_SEC = 180;

export function MBWayCheckout({
  totalAmount,
  orderId,
  onSuccess,
  onBack,
}: MBWayCheckoutProps) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<MBWayStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(MBWAY_TIMEOUT_SEC);

  const txRef = useRef<MBWayTransaction | null>(null);
  const pollerRef = useRef<{ stop: () => void } | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ringRotation = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const { t } = useI18n();

  useEffect(() => {
    return () => {
      pollerRef.current?.stop();
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  /* Spinner */
  useEffect(() => {
    if (status !== "pending") return;
    const spin = Animated.loop(
      Animated.timing(ringRotation, {
        toValue: 1,
        duration: 2400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    spin.start();
    return () => spin.stop();
  }, [status, ringRotation]);

  const playSuccess = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Animated.parallel([
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(checkOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [checkScale, checkOpacity]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    const clean = phone.replace(/\s/g, "");

    if (!validatePTMobile(clean)) {
      setError(t.phoneInvalid);
      if (Platform.OS !== "web")
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setStatus("validating");
    const result = await createMBWayTransaction(clean, totalAmount, orderId);

    if (!result.ok || !result.transaction) {
      setStatus("error");
      setError(
        result.errorCode === "10002"
          ? t.phoneNotRegistered
          : result.errorMessage ?? t.transactionError,
      );
      return;
    }

    txRef.current = result.transaction;
    setStatus("pending");
    setSecondsLeft(MBWAY_TIMEOUT_SEC);

    countdownRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    pollerRef.current = startMBWayPolling(result.transaction, (poll) => {
      if (poll.status === "authorized") {
        setStatus("authorized");
        pollerRef.current?.stop();
        if (countdownRef.current) clearInterval(countdownRef.current);
        playSuccess();
        setTimeout(() => onSuccess(result.transaction!.transactionId), 2200);
      } else if (poll.status === "declined") {
        setStatus("declined");
        pollerRef.current?.stop();
        if (countdownRef.current) clearInterval(countdownRef.current);
        setError(t.paymentDeclined);
      } else if (poll.status === "expired") {
        setStatus("expired");
        pollerRef.current?.stop();
        if (countdownRef.current) clearInterval(countdownRef.current);
        setError(t.paymentExpired);
      }
    });
  }, [phone, totalAmount, orderId, onSuccess, playSuccess]);

  const spinDeg = ringRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timerText = `${minutes}:${secs.toString().padStart(2, "0")}`;

  const isInputPhase =
    status === "idle" || status === "error" || status === "expired" || status === "declined";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>{t.back}</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>{t.mbwayTitle}</Text>
      <Text style={styles.subtitle}>{t.mbwaySubtitle}</Text>

      {/* Total pill */}
      <View style={styles.totalPill}>
        <Text style={styles.totalLabel}>{t.total}</Text>
        <Text style={styles.totalValue}>€{totalAmount.toFixed(2)}</Text>
      </View>

      {/* ═══ INPUT PHASE ═══ */}
      {isInputPhase && (
        <>
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>{t.phoneLabel}</Text>
            <View style={styles.inputRow}>
              <Text style={styles.prefix}>{t.phonePrefix}</Text>
              <TextInput
                value={phone}
                onChangeText={(t) => {
                  setPhone(t.replace(/[^0-9]/g, ""));
                  if (error) setError(null);
                }}
                placeholder={t.phonePlaceholder}
                placeholderTextColor={Colors.textTertiary}
                keyboardType="numeric"
                maxLength={9}
                style={styles.input}
                autoFocus
              />
            </View>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          )}

          <Pressable onPress={handleSubmit} style={styles.sendBtn}>
            <Text style={styles.sendBtnText}>{t.sendPaymentRequest}</Text>
          </Pressable>

          <Text style={styles.hint}>
            {t.mbwayHint}
          </Text>
        </>
      )}

      {/* ═══ VALIDATING ═══ */}
      {status === "validating" && (
        <View style={styles.center}>
          <Text style={styles.waitText}>{t.validatingNumber}</Text>
        </View>
      )}

      {/* ═══ PENDING ═══ */}
      {status === "pending" && (
        <View style={styles.center}>
          <View style={styles.timerOuter}>
            <Animated.View
              style={[styles.timerRing, { transform: [{ rotate: spinDeg }] }]}
            />
            <View style={styles.timerCenter}>
              <Text style={styles.timerDigits}>{timerText}</Text>
            </View>
          </View>

          <Text style={styles.waitTitle}>{t.awaitingAuth}</Text>
          <Text style={styles.waitSub}>
            {t.awaitingInstruction}{" "}
            <Text style={styles.waitAmount}>€{totalAmount.toFixed(2)}</Text>
          </Text>

          <View style={styles.phonePill}>
            <Text style={styles.phonePillText}>+351 {phone}</Text>
          </View>
        </View>
      )}

      {/* ═══ SUCCESS ═══ */}
      {status === "authorized" && (
        <View style={styles.center}>
          <Animated.View
            style={[
              styles.checkCircle,
              { opacity: checkOpacity, transform: [{ scale: checkScale }] },
            ]}
          >
            <Text style={styles.checkMark}>✓</Text>
          </Animated.View>
          <Text style={styles.successTitle}>{t.paymentConfirmed}</Text>
          <Text style={styles.successSub}>
            €{totalAmount.toFixed(2)} {t.authorizedViaMbway}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
  },

  headerRow: { marginBottom: Spacing.sm },
  backBtn: {
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignSelf: "flex-start",
  },
  backText: { fontSize: FontSize.sm, color: Colors.textSecondary },

  title: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    color: Colors.primaryDark,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    textAlign: "center",
    marginTop: 2,
  },

  totalPill: {
    alignSelf: "center",
    marginTop: Spacing.lg,
    borderRadius: Radius.full,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.sm,
  },
  totalLabel: { fontSize: FontSize.xs, color: Colors.primaryDark },
  totalValue: { fontSize: FontSize.xxl, fontWeight: "700", color: Colors.primaryDark },

  /* Input */
  inputBox: {
    marginTop: Spacing.xxl,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
    padding: Spacing.md,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  inputRow: { flexDirection: "row", alignItems: "center" },
  prefix: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.xxl,
    fontWeight: "700",
    color: Colors.textPrimary,
    padding: 0,
  },

  errorBox: {
    marginTop: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: "#FEE2E2",
    padding: Spacing.md,
  },
  errorText: { fontSize: FontSize.sm, color: Colors.error, lineHeight: 18 },

  sendBtn: {
    marginTop: Spacing.xl,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    alignItems: "center",
  },
  sendBtnText: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.textOnPrimary,
  },

  hint: {
    marginTop: Spacing.md,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: "center",
    lineHeight: 16,
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: Spacing.xl },

  waitText: { fontSize: FontSize.md, color: Colors.textSecondary },

  timerOuter: {
    width: 130,
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xxl,
  },
  timerRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius.full,
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: Colors.primary,
    borderRightColor: "#C8E6C9",
  },
  timerCenter: {
    width: 110,
    height: 110,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  timerDigits: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.primaryDark,
    letterSpacing: 2,
  },

  waitTitle: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  waitSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  waitAmount: { fontWeight: "700", color: Colors.primaryDark },

  phonePill: {
    marginTop: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  phonePillText: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.textSecondary },

  checkCircle: {
    width: 90,
    height: 90,
    borderRadius: Radius.full,
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  checkMark: { fontSize: 40, fontWeight: "700", color: Colors.primary },
  successTitle: {
    fontSize: FontSize.xxl,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  successSub: { fontSize: FontSize.md, color: Colors.textSecondary },
});
