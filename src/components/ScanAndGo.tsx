import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, FontSize, Radius, Spacing } from "../theme";
import { useI18n } from "../i18n";

type ScanAndGoProps = {
  active: boolean;
  onClose: () => void;
  onScanned: (code: string) => void;
};

export function ScanAndGo({ active, onClose, onScanned }: ScanAndGoProps) {
  const { t } = useI18n();
  if (!active) return null;

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>{t.scanAndGo}</Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>{t.closeScan}</Text>
          </Pressable>
        </View>
        <View style={styles.webPlaceholder}>
          <Text style={styles.placeholderIcon}>📷</Text>
          <Text style={styles.placeholderText}>
            {t.scanWebPlaceholder}
          </Text>
        </View>
      </View>
    );
  }

  return <ScanAndGoNative onClose={onClose} onScanned={onScanned} t={t} />;
}

function ScanAndGoNative({
  onClose,
  onScanned,
  t,
}: {
  onClose: () => void;
  onScanned: (code: string) => void;
  t: ReturnType<typeof useI18n>["t"];
}) {
  const { CameraView, useCameraPermissions } = require("expo-camera");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>{t.loadingCamera}</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>
          {t.cameraPermission}
        </Text>
        <Pressable onPress={requestPermission} style={styles.enableBtn}>
          <Text style={styles.enableText}>{t.enableCamera}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>{t.scanAndGo}</Text>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>{t.closeScan}</Text>
        </Pressable>
      </View>
      <View style={styles.cameraWrap}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a"],
          }}
          onBarcodeScanned={(event: { data: string }) => onScanned(event.data)}
        />
        <View style={styles.reticle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.xxl,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  heading: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  closeBtn: {
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  closeText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  cameraWrap: {
    height: 200,
    margin: Spacing.lg,
    borderRadius: Radius.md,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: { ...StyleSheet.absoluteFillObject },
  reticle: {
    height: 96,
    width: 96,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  webPlaceholder: {
    padding: Spacing.xxl,
    alignItems: "center",
  },
  placeholderIcon: { fontSize: 40, marginBottom: Spacing.sm },
  placeholderText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  loadingText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    padding: Spacing.lg,
  },
  enableBtn: {
    marginTop: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: "center",
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  enableText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textOnPrimary,
  },
});
