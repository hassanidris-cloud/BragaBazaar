import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Profile } from "../types";
import { Colors, FontSize, Radius, Shadow, Spacing } from "../theme";
import { useI18n } from "../i18n";

export type LoyaltyHubProps = {
  profile: Profile;
  onViewHistory: () => void;
};

const TIER_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  Bronze: { color: "#795548", bg: "#EFEBE9", border: "#BCAAA4" },
  Silver: { color: "#607D8B", bg: "#ECEFF1", border: "#B0BEC5" },
  Gold: { color: "#F57F17", bg: "#FFF8E1", border: "#FFD54F" },
  Platinum: { color: "#1A237E", bg: "#E8EAF6", border: "#7986CB" },
};

export function LoyaltyHub({ profile, onViewHistory }: LoyaltyHubProps) {
  const tier = TIER_CONFIG[profile.loyalty_tier] ?? TIER_CONFIG.Bronze;
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      {/* Tier card */}
      <View style={[styles.tierCard, { borderColor: tier.border, backgroundColor: tier.bg }]}>
        <View style={styles.tierTop}>
          <View style={[styles.tierBadge, { backgroundColor: tier.color }]}>
            <Text style={styles.tierBadgeText}>{profile.loyalty_tier}</Text>
          </View>
          <Text style={styles.memberSince}>{t.memberSince}</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.cardLabel}>{t.bazaarCard}</Text>
      </View>

      {/* Stats grid */}
      <View style={styles.statsRow}>
        <StatBox label={t.bazaarPoints} value={profile.loyalty_points.toLocaleString()} icon="⭐" />
        <StatBox label={t.totalSaved} value={`€${profile.total_saved.toFixed(2)}`} icon="💰" />
      </View>

      {/* Next milestone */}
      <View style={styles.milestoneBox}>
        <Text style={styles.milestoneLabel}>{t.nextLevel}</Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min((profile.loyalty_points / 2000) * 100, 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.milestoneHint}>
          {Math.max(2000 - profile.loyalty_points, 0)} {t.ptsForPlatinum}
        </Text>
      </View>

      {/* Rewards preview */}
      <View style={styles.rewardsSection}>
        <Text style={styles.sectionTitle}>{t.availableRewards}</Text>
        <View style={styles.rewardCard}>
          <Text style={styles.rewardIcon}>🎁</Text>
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardName}>{t.reward5off}</Text>
            <Text style={styles.rewardCost}>{t.reward5offPts}</Text>
          </View>
        </View>
        <View style={styles.rewardCard}>
          <Text style={styles.rewardIcon}>☕</Text>
          <View style={styles.rewardInfo}>
            <Text style={styles.rewardName}>{t.rewardFreeCoffee}</Text>
            <Text style={styles.rewardCost}>{t.rewardFreeCoffeePts}</Text>
          </View>
        </View>
      </View>

      {/* CTA */}
      <Pressable onPress={onViewHistory} style={styles.historyBtn}>
        <Text style={styles.historyBtnText}>{t.viewPurchaseHistory}</Text>
      </Pressable>
    </View>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, gap: Spacing.md },

  tierCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.xl,
    ...Shadow.md,
  },
  tierTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tierBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  tierBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.textOnPrimary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  memberSince: { fontSize: FontSize.xs, color: Colors.textTertiary },
  name: {
    marginTop: Spacing.md,
    fontSize: FontSize.xxl,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  cardLabel: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },

  statsRow: { flexDirection: "row", gap: Spacing.sm },
  statBox: {
    flex: 1,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    alignItems: "center",
    ...Shadow.sm,
  },
  statIcon: { fontSize: 24, marginBottom: Spacing.xs },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  statLabel: {
    marginTop: Spacing.xs,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },

  milestoneBox: {
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  milestoneLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  progressTrack: {
    marginTop: Spacing.sm,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  milestoneHint: {
    marginTop: Spacing.sm,
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },

  rewardsSection: { gap: Spacing.sm },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  rewardIcon: { fontSize: 28, marginRight: Spacing.md },
  rewardInfo: { flex: 1 },
  rewardName: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  rewardCost: {
    marginTop: 2,
    fontSize: FontSize.xs,
    color: Colors.accent,
    fontWeight: "600",
  },

  historyBtn: {
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  historyBtnText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.primary,
  },
});
