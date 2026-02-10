import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PaymentMethod } from "../types";
import { Colors, FontSize, Radius, Shadow, Spacing } from "../theme";
import { MBWayCheckout } from "./MBWayCheckout";
import { useI18n } from "../i18n";

export type PaymentSheetProps = {
  total: number;
  onConfirm: (method: PaymentMethod) => void;
  onClose: () => void;
};

const METHODS: { key: PaymentMethod; labelKey: "methodCard" | "methodMbway" | "methodMultibanco" | "methodCash"; icon: string; descKey: "methodCardDesc" | "methodMbwayDesc" | "methodMultibancoDesc" | "methodCashDesc" }[] = [
  { key: "stripe", labelKey: "methodCard", icon: "💳", descKey: "methodCardDesc" },
  { key: "mbway", labelKey: "methodMbway", icon: "📱", descKey: "methodMbwayDesc" },
  { key: "multibanco", labelKey: "methodMultibanco", icon: "🏧", descKey: "methodMultibancoDesc" },
  { key: "cash_on_delivery", labelKey: "methodCash", icon: "💶", descKey: "methodCashDesc" },
];

export function PaymentSheet({ total, onConfirm, onClose }: PaymentSheetProps) {
  const [selected, setSelected] = useState<PaymentMethod>("mbway");
  const [mbwayActive, setMbwayActive] = useState(false);
  const { t } = useI18n();

  /* If MB WAY flow is active, render the full checkout */
  if (mbwayActive) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.backdrop} />
        <View style={styles.mbwaySheet}>
          <MBWayCheckout
            totalAmount={total}
            orderId={`bzo-${Date.now()}`}
            onSuccess={() => onConfirm("mbway")}
            onBack={() => setMbwayActive(false)}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>{t.payment}</Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        {/* Total */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>{t.totalToPay}</Text>
          <Text style={styles.totalValue}>€{total.toFixed(2)}</Text>
        </View>

        {/* Methods */}
        <View style={styles.methodsList}>
          {METHODS.map((m) => {
            const active = selected === m.key;
            return (
              <Pressable
                key={m.key}
                onPress={() => setSelected(m.key)}
                style={[styles.methodCard, active && styles.methodCardActive]}
              >
                <Text style={styles.methodIcon}>{m.icon}</Text>
                <View style={styles.methodInfo}>
                  <Text style={[styles.methodLabel, active && styles.methodLabelActive]}>
                    {t[m.labelKey]}
                  </Text>
                  <Text style={styles.methodDesc}>{t[m.descKey]}</Text>
                </View>
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Confirm */}
        <Pressable
          onPress={() => {
            if (selected === "mbway") {
              setMbwayActive(true);
            } else {
              onConfirm(selected);
            }
          }}
          style={styles.confirmBtn}
        >
          <Text style={styles.confirmText}>
            {selected === "stripe"
              ? t.payNow
              : selected === "mbway"
                ? t.continueWithMbway
                : t.confirmOrder}
          </Text>
        </Pressable>

        <Text style={styles.legalNote}>
          {t.legalNote}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    ...Shadow.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontSize: FontSize.xxl,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { fontSize: FontSize.lg, color: Colors.textSecondary },

  totalBox: {
    marginTop: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: "#E8F5E9",
    padding: Spacing.lg,
    alignItems: "center",
  },
  totalLabel: { fontSize: FontSize.sm, color: Colors.primaryDark },
  totalValue: {
    marginTop: Spacing.xs,
    fontSize: FontSize.xxxl,
    fontWeight: "800",
    color: Colors.primaryDark,
  },

  methodsList: { marginTop: Spacing.lg, gap: Spacing.sm },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
  },
  methodCardActive: {
    borderColor: Colors.primary,
    backgroundColor: "#F1F8E9",
  },
  methodIcon: { fontSize: 22, marginRight: Spacing.md },
  methodInfo: { flex: 1 },
  methodLabel: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  methodLabelActive: { color: Colors.primaryDark },
  methodDesc: {
    marginTop: 2,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: Colors.primary },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },

  confirmBtn: {
    marginTop: Spacing.xl,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmText: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textOnPrimary,
  },
  legalNote: {
    marginTop: Spacing.sm,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: "center",
  },

  mbwaySheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: "92%",
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    backgroundColor: Colors.surface,
    overflow: "hidden",
  },
});
