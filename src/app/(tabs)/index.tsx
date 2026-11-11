import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Halaman Beranda Utama</Text>
      <Text style={styles.subtitle}>
       Oik.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 20,
  },
  title: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: 6,
    color: "#64748b",
    fontSize: 13,
    textAlign: "center",
  },
});
