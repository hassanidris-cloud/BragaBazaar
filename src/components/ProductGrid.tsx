import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import { Product } from "../types";
import { useI18n } from "../i18n";

type SortMode = "default" | "price_asc" | "price_desc" | "name";

type Props = {
  products: Product[];
  onPress: (p: Product) => void;
  onAdd: (pid: string) => void;
  loading?: boolean;
};

export function ProductGrid({ products, onPress, onAdd, loading }: Props) {
  const { t } = useI18n();
  const [sort, setSort] = useState<SortMode>("default");
  const [showPromosOnly, setShowPromosOnly] = useState(false);

  const sorted = React.useMemo(() => {
    let list = [...products];
    if (showPromosOnly) {
      list = list.filter((p) => p.on_sale || p.regularPrice - p.bazaarPrice > 0);
    }
    switch (sort) {
      case "price_asc":
        return list.sort((a, b) => a.bazaarPrice - b.bazaarPrice);
      case "price_desc":
        return list.sort((a, b) => b.bazaarPrice - a.bazaarPrice);
      case "name":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [products, sort, showPromosOnly]);

  if (loading) {
    return (
      <View
        className="flex-row flex-wrap"
        style={{ paddingHorizontal: "5%" as unknown as number, gap: 20 }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </View>
    );
  }

  /* Filter pill helper */
  const FilterPill = ({ label, active, onPress: onP }: { label: string; active: boolean; onPress: () => void }) => (
    <Pressable
      onPress={onP}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: active ? "#2d7a32" : "#FFFFFF",
        borderWidth: 1,
        borderColor: active ? "#2d7a32" : "#eeeeee",
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: active ? "700" : "500", color: active ? "#FFFFFF" : "#555555" }}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View className="flex-1">
      {/* ─── Filter pills ─── */}
      <View
        className="flex-row items-center"
        style={{ paddingHorizontal: 16, paddingBottom: 10, gap: 8 }}
      >
        <FilterPill label={t.filterAll ?? "All"} active={sort === "default" && !showPromosOnly} onPress={() => { setSort("default"); setShowPromosOnly(false); }} />
        <FilterPill label={t.promotions ?? "Deals"} active={showPromosOnly} onPress={() => setShowPromosOnly(!showPromosOnly)} />
        <FilterPill label={`${t.sortPrice ?? "Price"} ${sort === "price_asc" ? "↑" : sort === "price_desc" ? "↓" : ""}`} active={sort.startsWith("price")} onPress={() => setSort(sort === "price_asc" ? "price_desc" : "price_asc")} />
        <FilterPill label={t.sortName ?? "Name"} active={sort === "name"} onPress={() => setSort(sort === "name" ? "default" : "name")} />
      </View>

      {/* ─── Results count ─── */}
      <View style={{ paddingHorizontal: "5%" as unknown as number, paddingBottom: 8 }}>
        <Text style={{ fontSize: 12, color: "#999999" }}>
          {sorted.length} {t.productsFound ?? "products found"}
        </Text>
      </View>

      {/* ─── Product grid — repeat(auto-fit, minmax(200px, 1fr)) ─── */}
      <View
        className="flex-row flex-wrap"
        style={{ paddingHorizontal: "5%" as unknown as number, paddingVertical: 40, gap: 20 }}
      >
        {sorted.length > 0 ? (
          sorted.map((item) => (
            <ProductCard key={item.id} product={item} onPress={onPress} onAdd={onAdd} />
          ))
        ) : (
          <View className="py-12 items-center" style={{ width: "100%" }}>
            <Text style={{ fontSize: 14, color: "#999999" }}>{t.noProductsInCategory}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
