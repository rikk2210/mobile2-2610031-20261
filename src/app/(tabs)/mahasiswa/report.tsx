import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useMahasiswa } from "@/context/MahasiswaContext";

export default function ReportMahasiswaScreen() {
  const { dataMahasiswa } = useMahasiswa();

  const totalMahasiswa = dataMahasiswa.length;
  const mahasiswaAktif = dataMahasiswa.filter(
    (mahasiswa) => mahasiswa.status === "Aktif",
  ).length;
  const mahasiswaTI = dataMahasiswa.filter((mahasiswa) =>
    mahasiswa.prodi.toLowerCase().includes("informatika"),
  ).length;
  const mahasiswaSI = dataMahasiswa.filter((mahasiswa) =>
    mahasiswa.prodi.toLowerCase().includes("sistem"),
  ).length;
  const persentaseAktif =
    totalMahasiswa > 0
      ? ((mahasiswaAktif / totalMahasiswa) * 100).toFixed(1)
      : "0.0";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Laporan & Ringkasan Data Real-Time</Text>
      <Text style={styles.subtitle}>
        Statistik diperbarui secara otomatis ketika data ditambah atau dihapus:
      </Text>

      <View style={styles.grid}>
        <View style={[styles.card, { borderLeftColor: "#072deb" }]}>
          <Text style={styles.number}>{totalMahasiswa}</Text>
          <Text style={styles.cardLabel}>Total Mahasiswa</Text>
        </View>
        <View style={[styles.card, { borderLeftColor: "#16a34a" }]}>
          <Text style={styles.number}>{mahasiswaAktif}</Text>
          <Text style={styles.cardLabel}>Mahasiswa Aktif</Text>
        </View>
        <View style={[styles.card, { borderLeftColor: "#d97706" }]}>
          <Text style={styles.number}>{mahasiswaTI}</Text>
          <Text style={styles.cardLabel}>Teknik Informatika</Text>
        </View>
        <View style={[styles.card, { borderLeftColor: "#7c3aed" }]}>
          <Text style={styles.number}>{mahasiswaSI}</Text>
          <Text style={styles.cardLabel}>Sistem Informasi</Text>
        </View>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Ringkasan Akademik Real-Time</Text>
        <Text style={styles.summaryDesc}>
          • Persentase keaktifan mahasiswa saat ini adalah {persentaseAktif}%.
          {"\n"}• Sebanyak {totalMahasiswa - mahasiswaAktif} mahasiswa tercatat
          cuti kuliah.
          {"\n"}• Seluruh perhitungan terhubung langsung ke Context API secara
          instan.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 18 },
  title: { fontSize: 16, fontWeight: "bold", color: "#0f172a" },
  subtitle: { fontSize: 12, color: "#64748b", marginTop: 4, marginBottom: 18 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderLeftWidth: 4,
  },
  number: { fontSize: 24, fontWeight: "bold", color: "#0f172a" },
  cardLabel: {
    fontSize: 11.5,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "500",
  },
  summaryBox: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginTop: 14,
  },
  summaryTitle: {
    fontSize: 12.5,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 6,
  },
  summaryDesc: { fontSize: 12, color: "#475569", lineHeight: 18 },
});
