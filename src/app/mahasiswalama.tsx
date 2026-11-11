import { useState } from "react";
import { Link } from "expo-router";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Mahasiswa = {
  id: string;
  nim: string;
  nama: string;
  prodi: string;
  email: string;
};

const dataAwal: Mahasiswa[] = [
  {
    id: "1",
    nim: "2026001",
    nama: "Budi Santoso",
    prodi: "Teknik Informatika",
    email: "",
  },
  {
    id: "2",
    nim: "2026002",
    nama: "Siti Rahma",
    prodi: "Sistem Informasi",
    email: "",
  },
];

export default function FormMahasiswa() {
  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [prodi, setProdi] = useState("");
  const [email, setEmail] = useState("");
  const [daftarMahasiswa, setDaftarMahasiswa] = useState(dataAwal);
  const [nextId, setNextId] = useState(dataAwal.length + 1);

  const simpanData = () => {
    if (!nim.trim() || !nama.trim() || !prodi.trim()) {
      Alert.alert(
        "Data belum lengkap",
        "Harap lengkapi NIM, Nama, dan Program Studi!",
      );
      return;
    }

    const dataBaru: Mahasiswa = {
      id: nextId.toString(),
      nim: nim.trim(),
      nama: nama.trim(),
      prodi: prodi.trim(),
      email: email.trim(),
    };

    setDaftarMahasiswa((daftarSaatIni) => [...daftarSaatIni, dataBaru]);
    setNextId((idSaatIni) => idSaatIni + 1);
    setNim("");
    setNama("");
    setProdi("");
    setEmail("");
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      data={daftarMahasiswa}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.cardItem}>
          <View style={styles.cardBadge}>
            <Text style={styles.cardBadgeText}>{item.nim}</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardNama}>{item.nama}</Text>
            <Text style={styles.cardProdi}>Program Studi: {item.prodi}</Text>
            {item.email ? (
              <Text style={styles.cardEmail}>Email: {item.email}</Text>
            ) : null}
          </View>
        </View>
      )}
      ListHeaderComponent={
        <View>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Form Pendataan Mahasiswa</Text>
            <TextInput
              style={styles.input}
              placeholder="Nomor Induk Mahasiswa (NIM)"
              placeholderTextColor="#94a3b8"
              value={nim}
              onChangeText={setNim}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Nama Lengkap"
              placeholderTextColor="#94a3b8"
              value={nama}
              onChangeText={setNama}
            />
            <TextInput
              style={styles.input}
              placeholder="Program Studi (contoh: Teknik Informatika)"
              placeholderTextColor="#94a3b8"
              value={prodi}
              onChangeText={setProdi}
            />
            <TextInput
              style={styles.input}
              placeholder="Alamat Email (opsional)"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.buttonSimpan}
              activeOpacity={0.7}
              onPress={simpanData}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>+ Simpan ke Daftar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listHeaderContainer}>
            <Text style={styles.listHeader}>Daftar Mahasiswa (FlatList)</Text>
            <Text style={styles.listCount}>
              {daftarMahasiswa.length} mahasiswa terdaftar
            </Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>Belum ada data mahasiswa.</Text>
      }
      ListFooterComponent={
        <Link href="/indexlama" asChild>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Kembali ke Menu Utama</Text>
          </TouchableOpacity>
        </Link>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  formContainer: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    marginBottom: 12,
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    color: "#0f172a",
    fontSize: 14,
  },
  buttonSimpan: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 4,
    backgroundColor: "#2563eb",
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  listHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listHeader: {
    color: "#1e293b",
    fontSize: 15,
    fontWeight: "700",
  },
  listCount: {
    marginTop: 4,
    marginBottom: 10,
    color: "#64748b",
    fontSize: 12,
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
  },
  cardBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 12,
    backgroundColor: "#e0f2fe",
    borderRadius: 6,
  },
  cardBadgeText: {
    color: "#0284c7",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardBody: {
    flex: 1,
  },
  cardNama: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "bold",
  },
  cardProdi: {
    marginTop: 2,
    color: "#64748b",
    fontSize: 12,
  },
  cardEmail: {
    marginTop: 2,
    color: "#64748b",
    fontSize: 12,
  },
  emptyText: {
    marginTop: 20,
    color: "#94a3b8",
    fontStyle: "italic",
    textAlign: "center",
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#475569",
    borderRadius: 8,
  },
});
