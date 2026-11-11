import { StyleSheet, Text, View } from "react-native";

export default function ProfilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Pengguna</Text>
      <Text style={styles.subtitle}>uhuyy.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8fafc",
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
  },
});
