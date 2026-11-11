import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useMahasiswa } from "@/context/MahasiswaContext";

export default function DataMahasiswaScreen() {
  const { dataMahasiswa, hapusMahasiswa } = useMahasiswa();

  const konfirmasiHapus = (id: string, nama: string) => {
    Alert.alert(
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus data ${nama}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => hapusMahasiswa(id),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dataMahasiswa}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listArea}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Belum ada data mahasiswa.</Text>
            <Text style={styles.emptySubText}>
              Silakan tambahkan data baru melalui tab Input.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.nama.charAt(0)}</Text>
            </View>
            <View style={styles.infoArea}>
              <Text style={styles.nama}>{item.nama}</Text>
              <Text style={styles.subText}>NIM: {item.nim}</Text>
              <Text style={styles.prodiText}>{item.prodi}</Text>
            </View>
            <View style={styles.actions}>
              <View
                style={[
                  styles.badge,
                  item.status === "Aktif"
                    ? styles.badgeActive
                    : styles.badgeInactive,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    item.status === "Aktif"
                      ? styles.badgeTextActive
                      : styles.badgeTextInactive,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => konfirmasiHapus(item.id, item.nama)}
                accessibilityRole="button"
                accessibilityLabel={`Hapus data ${item.nama}`}
                hitSlop={8}
              >
                <Text style={styles.hapusText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  listArea: { padding: 16, gap: 12, flexGrow: 1 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { fontSize: 16, fontWeight: "bold", color: "#072deb" },
  infoArea: { flex: 1 },
  nama: { fontSize: 14, fontWeight: "bold", color: "#0f172a" },
  subText: { fontSize: 12, color: "#64748b", marginTop: 2 },
  prodiText: { fontSize: 12, color: "#072deb", marginTop: 2 },
  actions: { alignItems: "flex-end", gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeActive: { backgroundColor: "#dcfce7" },
  badgeInactive: { backgroundColor: "#fee2e2" },
  badgeText: { fontSize: 11, fontWeight: "bold" },
  badgeTextActive: { color: "#16a34a" },
  badgeTextInactive: { color: "#dc2626" },
  hapusText: { fontSize: 11, color: "#dc2626", fontWeight: "600" },
  emptyBox: { alignItems: "center", marginTop: 40 },
  emptyText: { fontSize: 14, fontWeight: "bold", color: "#64748b" },
  emptySubText: { fontSize: 12, color: "#94a3b8", marginTop: 4 },
});
