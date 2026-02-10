import React from "react";
import { Pressable, Text, View } from "react-native";
import { ALL_CATEGORIES, Category } from "../types";
import { useI18n } from "../i18n";
import type { TranslationKeys } from "../i18n/pt";

const CATEGORY_I18N_KEY: Record<Category, TranslationKeys> = {
  Fresh: "catFresh",
  Bakery: "catBakery",
  Beverages: "catBeverages",
  Pantry: "catPantry",
  "Braga Specialties": "catBragaSpecialties",
};

/* Category emoji icons — matching the HTML template */
const CATEGORY_ICON: Record<Category, string> = {
  Fresh: "🍎",
  Bakery: "🍞",
  Beverages: "🥛",
  Pantry: "🥫",
  "Braga Specialties": "⭐",
};

export type CategorySidebarProps = {
  selected: Category;
  onSelect: (cat: Category) => void;
};

export function CategorySidebar({ selected, onSelect }: CategorySidebarProps) {
  const { t } = useI18n();

  return (
    <View
      className="flex-row flex-wrap"
      style={{ paddingHorizontal: "5%" as unknown as number, paddingVertical: 20, gap: 20 }}
    >
      {ALL_CATEGORIES.map((cat) => {
        const active = cat === selected;
        return (
          <Pressable
            key={cat}
            onPress={() => onSelect(cat)}
            className="items-center justify-center"
            style={{
              flexGrow: 1,
              flexBasis: 200,
              maxWidth: "100%",
              paddingVertical: 20,
              paddingHorizontal: 8,
              backgroundColor: active ? "#E8F5E9" : "#f4f4f4",
              borderWidth: active ? 2 : 1,
              borderColor: active ? "#2d7a32" : "#eeeeee",
            }}
          >
            <Text style={{ fontSize: 32, marginBottom: 6 }}>
              {CATEGORY_ICON[cat]}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: active ? "700" : "500",
                color: active ? "#2d7a32" : "#555555",
                textAlign: "center",
              }}
              numberOfLines={1}
            >
              {t[CATEGORY_I18N_KEY[cat]]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
