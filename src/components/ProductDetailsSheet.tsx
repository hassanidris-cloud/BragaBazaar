import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Product } from "../types";
import { Colors, FontSize, Radius, Shadow, Spacing } from "../theme";
import { LazyImage } from "./LazyImage";
import { useI18n } from "../i18n";

export type ProductDetailsSheetProps = {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
};

export function ProductDetailsSheet({
  product,
  onClose,
  onAddToCart,
}: ProductDetailsSheetProps) {
  if (!product) return null;

  const { t } = useI18n();
  const savings = product.regularPrice - product.bazaarPrice;
  const savingsPct = Math.round((savings / product.regularPrice) * 100);

  const handleAdd = () => {
    if (Platform.OS !== "web")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAddToCart(product);
  };

  const stockLabel =
    product.stock_level === 0
      ? t.outOfStock
      : product.stock_level <= 3
        ? t.lastUnits.replace("{n}", String(product.stock_level))
        : t.inStock;
  const stockColor =
    product.stock_level === 0
      ? Colors.error
      : product.stock_level <= 3
        ? "#D97706"
        : Colors.primary;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image */}
          <View style={styles.imageBox}>
            <LazyImage
              source={product.imageAsset ?? { uri: product.image_url }}
              height={220}
            />
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.body}>
            {/* Category */}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>

            <Text style={styles.name}>{product.name}</Text>

            {/* Pricing */}
            <View style={styles.priceRow}>
              <Text style={styles.bazaarPrice}>
                €{product.bazaarPrice.toFixed(2)}
              </Text>
              <Text style={styles.regularPrice}>
                €{product.regularPrice.toFixed(2)}
              </Text>
              {savings > 0 && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>-{savingsPct}%</Text>
                </View>
              )}
            </View>
            <Text style={styles.priceNote}>{t.bazaarCardPrice}</Text>

            {/* Stock */}
            <View style={styles.stockRow}>
              <View style={[styles.stockDot, { backgroundColor: stockColor }]} />
              <Text style={[styles.stockText, { color: stockColor }]}>
                {stockLabel}
              </Text>
            </View>

            {/* Nutritional Info */}
            {product.nutritional_info && (
              <View style={styles.nutritionBox}>
                <Text style={styles.sectionTitle}>{t.nutritionalInfo}</Text>
                <View style={styles.nutritionGrid}>
                  <NutrientPill
                    label={t.calories}
                    value={`${product.nutritional_info.calories} kcal`}
                  />
                  <NutrientPill
                    label={t.protein}
                    value={`${product.nutritional_info.protein_g}g`}
                  />
                  <NutrientPill
                    label={t.fat}
                    value={`${product.nutritional_info.fat_g}g`}
                  />
                  <NutrientPill
                    label={t.carbs}
                    value={`${product.nutritional_info.carbs_g}g`}
                  />
                </View>
              </View>
            )}

            {/* Add to cart */}
            <Pressable
              onPress={handleAdd}
              disabled={product.stock_level === 0}
              style={[
                styles.addBtn,
                product.stock_level === 0 && styles.addBtnDisabled,
              ]}
            >
              <Text
                style={[
                  styles.addBtnText,
                  product.stock_level === 0 && styles.addBtnTextDisabled,
                ]}
              >
                {product.stock_level === 0
                  ? t.outOfStock
                  : t.addToCart}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function NutrientPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.nutrientPill}>
      <Text style={styles.nutrientValue}>{value}</Text>
      <Text style={styles.nutrientLabel}>{label}</Text>
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
    maxHeight: "88%",
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    backgroundColor: Colors.surface,
    overflow: "hidden",
    ...Shadow.lg,
  },
  imageBox: {
    width: "100%",
    height: 220,
    backgroundColor: Colors.surfaceAlt,
  },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.md,
  },
  closeBtnText: { color: Colors.textSecondary, fontSize: FontSize.lg },

  body: { padding: Spacing.xl },
  categoryBadge: {
    alignSelf: "flex-start",
    borderRadius: Radius.full,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  categoryText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.primary,
  },
  name: {
    marginTop: Spacing.sm,
    fontSize: FontSize.xxl,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  priceRow: {
    marginTop: Spacing.sm,
    flexDirection: "row",
    alignItems: "baseline",
  },
  bazaarPrice: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.primaryDark,
  },
  regularPrice: {
    marginLeft: Spacing.sm,
    fontSize: FontSize.lg,
    color: Colors.textTertiary,
    textDecorationLine: "line-through",
  },
  savingsBadge: {
    marginLeft: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  savingsText: { fontSize: FontSize.xs, fontWeight: "700", color: Colors.error },
  priceNote: {
    marginTop: Spacing.xs,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  stockRow: {
    marginTop: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  stockDot: { width: 8, height: 8, borderRadius: Radius.full },
  stockText: { marginLeft: Spacing.sm, fontSize: FontSize.sm, fontWeight: "600" },

  nutritionBox: {
    marginTop: Spacing.xl,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt,
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  nutritionGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  nutrientPill: {
    flex: 1,
    minWidth: 70,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    alignItems: "center",
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  nutrientValue: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  nutrientLabel: {
    marginTop: 2,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },

  addBtn: {
    marginTop: Spacing.xxl,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    alignItems: "center",
  },
  addBtnDisabled: { backgroundColor: Colors.surfaceAlt },
  addBtnText: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textOnPrimary,
  },
  addBtnTextDisabled: { color: Colors.textTertiary },
});
