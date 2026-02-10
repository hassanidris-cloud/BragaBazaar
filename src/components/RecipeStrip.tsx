import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Recipe } from "../types";
import { Colors, FontSize, Radius, Shadow, Spacing } from "../theme";
import { useI18n } from "../i18n";

type Props = {
  recipes: Recipe[];
  onAddRecipe: (r: Recipe) => void;
};

export function RecipeStrip({ recipes, onAddRecipe }: Props) {
  const { t } = useI18n();
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{t.quickRecipes}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        {recipes.map((r) => (
          <View key={r.id} style={styles.card}>
            <Text style={styles.name}>{r.name}</Text>
            <Text style={styles.desc} numberOfLines={2}>
              {r.description}
            </Text>
            <Pressable onPress={() => onAddRecipe(r)} style={styles.btn}>
              <Text style={styles.btnText}>{t.addAllIngredients}</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: Spacing.xxl },
  heading: {
    fontSize: FontSize.xl,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  scroll: { marginTop: Spacing.sm },
  card: {
    marginRight: Spacing.md,
    width: 220,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  name: {
    fontSize: FontSize.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  desc: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  btn: {
    marginTop: Spacing.md,
    alignItems: "center",
    borderRadius: Radius.full,
    backgroundColor: "#E8F5E9",
    paddingVertical: Spacing.sm,
  },
  btnText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.primary,
  },
});
