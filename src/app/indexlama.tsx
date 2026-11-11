import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MenuUtama() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Latihan</Text>
      <Text style={styles.subtitle}>Pilih latihan yang ingin dibuka</Text>

      <Link href="/mahasiswalama" asChild>
        <Pressable style={styles.menuButton} accessibilityRole="button">
          <Text style={styles.menuButtonTitle}>Input Mahasiswa</Text>
          <Text style={styles.menuButtonDescription}>
            Input data dan lihat daftar mahasiswa
          </Text>
        </Pressable>
      </Link>

      <Link href="/kalkulatorlama" asChild>
        <Pressable style={styles.menuButton} accessibilityRole="button">
          <Text style={styles.menuButtonTitle}>Kalkulator</Text>
          <Text style={styles.menuButtonDescription}>
            Hitung dengan empat operasi aritmatika
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  title: {
    color: "#0f172a",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    color: "#64748b",
    fontSize: 15,
    textAlign: "center",
  },
  menuButton: {
    padding: 20,
    marginBottom: 14,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
  },
  menuButtonTitle: {
    color: "#1d4ed8",
    fontSize: 18,
    fontWeight: "bold",
  },
  menuButtonDescription: {
    marginTop: 6,
    color: "#475569",
    fontSize: 14,
  },
});
