import React from "react";
import { Image, Platform, Pressable, Text, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Product } from "../types";
import { useI18n } from "../i18n";

type Props = {
  product: Product;
  onPress: (p: Product) => void;
  onAdd: (pid: string) => void;
};

export function ProductCard({ product, onPress, onAdd }: Props) {
  const { t } = useI18n();
  const outOfStock = product.stock_level === 0;
  const saved = product.regularPrice - product.bazaarPrice;
  const onSale = product.on_sale || saved > 0;

  const handleAdd = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onAdd(product.id);
  };

  const imageSource = product.imageAsset ?? { uri: product.image_url };

  return (
    <Pressable
      onPress={() => onPress(product)}
      style={{ flexGrow: 1, flexBasis: 200, maxWidth: "100%" }}
    >
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#eeeeee",
          overflow: "hidden",
        }}
      >
        {/* ─── Image Area ─── */}
        <View className="items-center justify-center relative" style={{ height: 150, padding: 15, backgroundColor: "#f4f4f4" }}>
          <Image source={imageSource} style={{ width: "80%", height: "80%" }} resizeMode="contain" />

          {/* Sale badge — top left */}
          {onSale && (
            <View
              className="absolute"
              style={{
                top: 8,
                left: 8,
                backgroundColor: "#e31e24",
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}
            >
              <Text className="text-white font-bold" style={{ fontSize: 11 }}>
                {t.saleBadge ?? "Sale"}
              </Text>
            </View>
          )}
        </View>

        {/* ─── Content Area — centered text per CSS ─── */}
        <View style={{ padding: 15, alignItems: "center" }}>
          {/* Product name */}
          <Text
            className="font-semibold"
            style={{ fontSize: 14, color: "#333333", lineHeight: 19, height: 38, textAlign: "center" }}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          {/* Price section */}
          <View style={{ marginTop: 6, alignItems: "center" }}>
            {onSale ? (
              <View className="flex-row items-baseline" style={{ gap: 6 }}>
                <Text className="font-bold" style={{ fontSize: 16, color: "#2d7a32" }}>
                  €{product.bazaarPrice.toFixed(2)}
                </Text>
                <Text className="line-through" style={{ fontSize: 12, color: "#999999" }}>
                  €{product.regularPrice.toFixed(2)}
                </Text>
              </View>
            ) : (
              <Text className="font-bold" style={{ fontSize: 16, color: "#333333" }}>
                €{product.bazaarPrice.toFixed(2)}
              </Text>
            )}
            <Text style={{ fontSize: 11, color: "#999999", marginTop: 2 }}>
              /kg
            </Text>
          </View>

          {/* Add to Cart button — full width, .add-btn */}
          {!outOfStock ? (
            <TouchableOpacity
              onPress={handleAdd}
              activeOpacity={0.8}
              className="items-center justify-center"
              style={{
                marginTop: 10,
                backgroundColor: "#2d7a32",
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 20,
                width: "100%",
              }}
            >
              <Text className="text-white font-bold" style={{ fontSize: 13 }}>
                {t.addToCart ?? "Add to Cart"}
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              className="items-center justify-center"
              style={{
                marginTop: 10,
                backgroundColor: "#f4f4f4",
                borderRadius: 5,
                paddingVertical: 10,
                width: "100%",
              }}
            >
              <Text className="font-medium" style={{ fontSize: 12, color: "#999999" }}>
                {t.outOfStock}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

/* ── Skeleton placeholder ─────────────────────────── */
export function ProductCardSkeleton() {
  return (
    <View
      style={{
        flexGrow: 1,
        flexBasis: 200,
        maxWidth: "100%",
        borderWidth: 1,
        borderColor: "#eeeeee",
        overflow: "hidden",
      }}
    >
      <View style={{ height: 150, backgroundColor: "#f4f4f4" }} />
      <View style={{ padding: 15 }}>
        <View className="rounded" style={{ height: 14, width: "90%", marginBottom: 4, backgroundColor: "#eeeeee" }} />
        <View className="rounded" style={{ height: 14, width: "60%", marginBottom: 10, backgroundColor: "#eeeeee" }} />
        <View className="rounded" style={{ height: 18, width: "40%", marginBottom: 10, backgroundColor: "#eeeeee" }} />
        <View className="rounded" style={{ height: 36, width: "100%", backgroundColor: "#eeeeee" }} />
      </View>
    </View>
  );
}
