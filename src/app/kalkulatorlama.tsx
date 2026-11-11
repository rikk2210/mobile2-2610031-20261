import { Link } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Operasi = "+" | "-" | "×" | "÷";

export default function Kalkulator() {
  const [angkaPertama, setAngkaPertama] = useState("");
  const [angkaKedua, setAngkaKedua] = useState("");
  const [hasil, setHasil] = useState("Masukkan angka dan pilih operasi.");

  const hitung = (operasi: Operasi) => {
    const pertama = Number.parseFloat(angkaPertama);
    const kedua = Number.parseFloat(angkaKedua);

    if (angkaPertama.trim() === "" || angkaKedua.trim() === "") {
      setHasil("Masukkan kedua angka terlebih dahulu.");
      return;
    }

    if (!Number.isFinite(pertama) || !Number.isFinite(kedua)) {
      setHasil("Kedua input harus berupa angka yang valid.");
      return;
    }

    if (operasi === "÷" && kedua === 0) {
      setHasil("Angka pembagi tidak boleh nol.");
      return;
    }

    const hasilHitung = {
      "+": pertama + kedua,
      "-": pertama - kedua,
      "×": pertama * kedua,
      "÷": pertama / kedua,
    }[operasi];

    setHasil(`${pertama} ${operasi} ${kedua} = ${hasilHitung}`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Kalkulator Sederhana</Text>

      <TextInput
        style={styles.input}
        placeholder="Angka pertama"
        placeholderTextColor="#94a3b8"
        value={angkaPertama}
        onChangeText={setAngkaPertama}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Angka kedua"
        placeholderTextColor="#94a3b8"
        value={angkaKedua}
        onChangeText={setAngkaKedua}
        keyboardType="numeric"
      />

      <View style={styles.operationRow}>
        {(["+", "-", "×", "÷"] as const).map((operasi) => (
          <Pressable
            key={operasi}
            style={styles.operationButton}
            onPress={() => hitung(operasi)}
            accessibilityRole="button"
            accessibilityLabel={`Operasi ${operasi}`}
          >
            <Text style={styles.operationButtonText}>{operasi}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.resultContainer} accessibilityLiveRegion="polite">
        <Text style={styles.resultLabel}>Hasil</Text>
        <Text style={styles.resultText}>{hasil}</Text>
      </View>

      <Link href="/indexlama" asChild>
        <Pressable style={styles.menuButton} accessibilityRole="button">
          <Text style={styles.menuButtonText}>Menu Utama</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    marginBottom: 24,
    color: "#0f172a",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    color: "#0f172a",
    fontSize: 14,
  },
  operationRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  operationButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
  },
  operationButtonText: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 24,
  },
  resultLabel: {
    marginBottom: 6,
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
  },
  resultText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "bold",
  },
  menuButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 32,
    backgroundColor: "#475569",
    borderRadius: 8,
  },
  menuButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
