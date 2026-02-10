import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { PickupSlot } from "../types";
import { Colors, FontSize, Radius, Shadow, Spacing } from "../theme";
import { useI18n } from "../i18n";

export type ClickCollectProps = {
  slots: PickupSlot[];
  onConfirm: (slotId: string) => void;
  onClose: () => void;
};

export function ClickCollect({ slots, onConfirm, onClose }: ClickCollectProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { t } = useI18n();

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>{t.clickCollectTitle}</Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>
        <Text style={styles.subheading}>
          {t.clickCollectSubtitle}
        </Text>

        {/* Slots */}
        <ScrollView style={styles.slotList}>
          {slots.map((slot) => {
            const active = selectedId === slot.id;
            return (
              <Pressable
                key={slot.id}
                disabled={!slot.available}
                onPress={() => setSelectedId(slot.id)}
                style={[
                  styles.slotCard,
                  active && styles.slotCardActive,
                  !slot.available && styles.slotCardDisabled,
                ]}
              >
                <View>
                  <Text
                    style={[
                      styles.slotDate,
                      !slot.available && styles.slotTextDisabled,
                    ]}
                  >
                    {slot.date}
                  </Text>
                  <Text
                    style={[
                      styles.slotWindow,
                      !slot.available && styles.slotTextDisabled,
                    ]}
                  >
                    {slot.window}
                  </Text>
                </View>
                {!slot.available ? (
                  <View style={styles.fullBadge}>
                    <Text style={styles.fullBadgeText}>{t.slotFull}</Text>
                  </View>
                ) : active ? (
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Confirm */}
        <Pressable
          disabled={!selectedId}
          onPress={() => selectedId && onConfirm(selectedId)}
          style={[styles.confirmBtn, !selectedId && styles.confirmBtnDisabled]}
        >
          <Text
            style={[
              styles.confirmText,
              !selectedId && styles.confirmTextDisabled,
            ]}
          >
            {t.confirmPickup}
          </Text>
        </Pressable>
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
    maxHeight: "80%",
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
  subheading: {
    marginTop: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  slotList: { marginTop: Spacing.lg, flex: 1 },
  slotCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  slotCardActive: {
    borderColor: Colors.primary,
    backgroundColor: "#F1F8E9",
  },
  slotCardDisabled: { opacity: 0.4 },
  slotDate: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  slotWindow: {
    marginTop: 2,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  slotTextDisabled: { color: Colors.textTertiary },
  fullBadge: {
    borderRadius: Radius.sm,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  fullBadgeText: { fontSize: FontSize.xs, fontWeight: "700", color: Colors.error },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: { fontSize: 14, fontWeight: "700", color: Colors.textOnPrimary },

  confirmBtn: {
    marginTop: Spacing.lg,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    alignItems: "center",
  },
  confirmBtnDisabled: { backgroundColor: Colors.surfaceAlt },
  confirmText: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textOnPrimary,
  },
  confirmTextDisabled: { color: Colors.textTertiary },
});
