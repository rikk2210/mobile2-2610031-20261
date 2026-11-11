import { TopTabs } from "expo-router/js-top-tabs";
import { MahasiswaProvider } from "@/context/MahasiswaContext";

export default function MahasiswaTopTabsLayout() {
  return (
    <MahasiswaProvider>
      <TopTabs
        screenOptions={{
          // Warna teks tab yang sedang aktif
          tabBarActiveTintColor: "#072deb",
          // Warna teks tab yang tidak aktif
          tabBarInactiveTintColor: "#64748b",
          // Penataan garis indikator berjalan di bawah tab aktif
          tabBarIndicatorStyle: {
            backgroundColor: "#072deb",
            height: 3,
          },
          // Gaya font label tab
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: "bold",
            textTransform: "none", // Mempertahankan huruf besar-kecil asli
          },
          // Gaya bilah fisik tab bar atas
          tabBarStyle: {
            backgroundColor: "#ffffff",
            elevation: 2,
            shadowOpacity: 0.08,
          },
        }}
      >
        {/* Tab 1: Halaman Data Mahasiswa */}
        <TopTabs.Screen
          name="index"
          options={{
            title: "Data",
          }}
        />
        {/* Tab 2: Halaman Input Mahasiswa */}
        <TopTabs.Screen
          name="input"
          options={{
            title: "Input",
          }}
        />
        {/* Tab 3: Halaman Laporan / Report */}
        <TopTabs.Screen
          name="report"
          options={{
            title: "Report",
          }}
        />
      </TopTabs>
    </MahasiswaProvider>
  );
}
