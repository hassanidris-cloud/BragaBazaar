import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CartItem, Product } from "../types";
import { Colors, FontSize, Radius, Shadow, Spacing } from "../theme";
import { useI18n } from "../i18n";

export type SmartCartProps = {
  open: boolean;
  items: CartItem[];
  productsById: Record<string, Product>;
  total: number;
  countdown: string;
  loyaltyPoints: number;
  totalSaved: number;
  onClose: () => void;
  onCheckout: () => void;
};

export function SmartCart({
  open,
  items,
  productsById,
  total,
  countdown,
  loyaltyPoints,
  totalSaved,
  onClose,
  onCheckout,
}: SmartCartProps) {
  const { t } = useI18n();

  if (!open) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable onPress={onClose} style={styles.backdrop} />
      <View style={styles.panel}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>{t.cart}</Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        {/* Delivery countdown */}
        <View style={styles.deliveryBox}>
          <Text style={styles.deliveryIcon}>🚚</Text>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryLabel}>{t.nextDelivery}</Text>
            <Text style={styles.deliveryTime}>{countdown}</Text>
          </View>
        </View>

        {/* Loyalty bar */}
        <View style={styles.loyaltyBar}>
          <Text style={styles.loyaltyIcon}>⭐</Text>
          <Text style={styles.loyaltyVal}>
            {loyaltyPoints} {t.loyaltyBarPts} · {t.loyaltyBarSaved} €{totalSaved.toFixed(2)}
          </Text>
        </View>

        {/* Items */}
        <ScrollView style={styles.itemsList}>
          {items.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>🛒</Text>
              <Text style={styles.emptyText}>{t.emptyCart}</Text>
            </View>
          ) : (
            items.map((item) => {
              const p = productsById[item.productId];
              if (!p) return null;
              const lineTotal = p.bazaarPrice * item.quantity;
              const lineSaved = (p.regularPrice - p.bazaarPrice) * item.quantity;
              return (
                <View key={item.productId} style={styles.itemCard}>
                  <View style={styles.itemTop}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    {lineSaved > 0 && (
                      <View style={styles.itemSaveBadge}>
                        <Text style={styles.itemSaveText}>
                          -€{lineSaved.toFixed(2)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.itemBottom}>
                    <Text style={styles.qty}>{t.qty} {item.quantity}</Text>
                    <Text style={styles.itemPrice}>€{lineTotal.toFixed(2)}</Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t.total}</Text>
            <Text style={styles.totalValue}>€{total.toFixed(2)}</Text>
          </View>
          <Pressable onPress={onCheckout} style={styles.checkoutBtn}>
            <Text style={styles.checkoutText}>{t.checkout}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  panel: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    width: "85%",
    backgroundColor: Colors.background,
    borderLeftWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    ...Shadow.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  deliveryBox: {
    marginTop: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    backgroundColor: "#E8F5E9",
    padding: Spacing.md,
  },
  deliveryIcon: { fontSize: 20, marginRight: Spacing.sm },
  deliveryInfo: {},
  deliveryLabel: { fontSize: FontSize.xs, color: Colors.primaryDark },
  deliveryTime: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.primaryDark,
  },

  loyaltyBar: {
    marginTop: Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    backgroundColor: "#FFF8E1",
    padding: Spacing.md,
  },
  loyaltyIcon: { fontSize: 16, marginRight: Spacing.sm },
  loyaltyVal: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: "#F57F17",
  },

  itemsList: { flex: 1, marginTop: Spacing.lg },

  emptyBox: { alignItems: "center", paddingVertical: 40 },
  emptyIcon: { fontSize: 40, marginBottom: Spacing.sm },
  emptyText: { fontSize: FontSize.md, color: Colors.textTertiary },

  itemCard: {
    marginBottom: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
  },
  itemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1,
  },
  itemSaveBadge: {
    borderRadius: Radius.sm,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginLeft: Spacing.sm,
  },
  itemSaveText: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.primary,
  },
  itemBottom: {
    marginTop: Spacing.xs,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  qty: { fontSize: FontSize.sm, color: Colors.textTertiary },
  itemPrice: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textPrimary,
  },

  footer: {
    borderTopWidth: 1,
    borderColor: Colors.border,
    paddingTop: Spacing.lg,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: FontSize.lg, color: Colors.textSecondary },
  totalValue: {
    fontSize: FontSize.xxxl,
    fontWeight: "800",
    color: Colors.primaryDark,
  },
  checkoutBtn: {
    marginTop: Spacing.lg,
    alignItems: "center",
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    paddingVertical: 15,
  },
  checkoutText: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textOnPrimary,
  },
});
