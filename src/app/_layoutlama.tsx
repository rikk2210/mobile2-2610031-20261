import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Menu Utama" }} />
      <Stack.Screen name="mahasiswa" options={{ title: "Input Mahasiswa" }} />
      <Stack.Screen name="kalkulator" options={{ title: "Kalkulator" }} />
    </Stack>
  );
}
