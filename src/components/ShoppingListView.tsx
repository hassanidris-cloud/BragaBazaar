import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Product, ShoppingList, ShoppingListItem } from "../types";
import { Colors, FontSize, Radius, Shadow, Spacing } from "../theme";
import { useI18n } from "../i18n";

export type ShoppingListViewProps = {
  list: ShoppingList;
  productsById: Record<string, Product>;
  onToggleItem: (itemId: string) => void;
  onAddAllToCart: () => void;
};

export function ShoppingListView({
  list,
  productsById,
  onToggleItem,
  onAddAllToCart,
}: ShoppingListViewProps) {
  const { t } = useI18n();
  const unchecked = list.items.filter((i) => !i.checked);
  const checked = list.items.filter((i) => i.checked);

  const totalEstimate = unchecked.reduce((sum, item) => {
    const p = productsById[item.productId];
    return sum + (p ? p.bazaarPrice * item.quantity : 0);
  }, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t.shoppingList}</Text>
          <Text style={styles.subtitle}>
            {unchecked.length} {t.itemsEstimated} €{totalEstimate.toFixed(2)}
          </Text>
        </View>
        <Pressable onPress={onAddAllToCart} style={styles.addAllBtn}>
          <Text style={styles.addAllText}>{t.addAllToCart}</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.list}>
        {/* Unchecked */}
        {unchecked.map((item) => (
          <ListItemRow
            key={item.id}
            item={item}
            product={productsById[item.productId]}
            onToggle={() => onToggleItem(item.id)}
            t={t}
          />
        ))}

        {/* Checked */}
        {checked.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>
              {t.completed} ({checked.length})
            </Text>
            {checked.map((item) => (
              <ListItemRow
                key={item.id}
                item={item}
                product={productsById[item.productId]}
                onToggle={() => onToggleItem(item.id)}
                t={t}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function ListItemRow({
  item,
  product,
  onToggle,
  t,
}: {
  item: ShoppingListItem;
  product?: Product;
  onToggle: () => void;
  t: ReturnType<typeof useI18n>["t"];
}) {
  const outOfStock = product ? product.stock_level === 0 : false;
  const lowStock = product ? product.stock_level > 0 && product.stock_level <= 3 : false;

  return (
    <Pressable
      onPress={onToggle}
      style={[styles.itemRow, item.checked && styles.itemRowChecked]}
    >
      {/* Checkbox */}
      <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
        {item.checked && <Text style={styles.checkmark}>✓</Text>}
      </View>

      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
          {product?.name ?? item.productId}
        </Text>
        <View style={styles.itemMeta}>
          <Text style={styles.itemQty}>{t.qty} {item.quantity}</Text>
          {product && (
            <Text style={styles.itemPrice}>
              €{(product.bazaarPrice * item.quantity).toFixed(2)}
            </Text>
          )}
          {outOfStock && (
            <View style={styles.badgeRed}>
              <Text style={styles.badgeRedText}>{t.outOfStock}</Text>
            </View>
          )}
          {lowStock && (
            <View style={styles.badgeYellow}>
              <Text style={styles.badgeYellowText}>{t.lowStockBadge}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  subtitle: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  addAllBtn: {
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  addAllText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textOnPrimary,
  },

  list: { flex: 1 },
  sectionHeader: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textTertiary,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  itemRowChecked: { opacity: 0.5 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  checkboxChecked: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  checkmark: { fontSize: 12, fontWeight: "700", color: Colors.textOnPrimary },
  itemInfo: { flex: 1 },
  itemName: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  itemNameChecked: {
    textDecorationLine: "line-through",
    color: Colors.textTertiary,
  },
  itemMeta: {
    marginTop: Spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  itemQty: { fontSize: FontSize.xs, color: Colors.textTertiary },
  itemPrice: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  badgeRed: {
    borderRadius: Radius.sm,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
  },
  badgeRedText: { fontSize: 9, fontWeight: "700", color: Colors.error },
  badgeYellow: {
    borderRadius: Radius.sm,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
  },
  badgeYellowText: { fontSize: 9, fontWeight: "700", color: "#D97706" },
});
