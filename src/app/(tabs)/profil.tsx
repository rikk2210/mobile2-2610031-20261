import { tabStyles } from "@/styles/tabStyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  clearAuthSession,
  getAuthSession,
  logoutApi,
  UserData,
} from "@/services/authService";

export default function ProfilScreen() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loadingLogout, setLoadingLogout] = useState(false);

  useEffect(() => {
    getAuthSession().then((session) => {
      if (session) {
        setUser(session.user);
      }
    }).catch((error: unknown) => {
      Alert.alert(
        "Gagal Memuat Profil",
        error instanceof Error ? error.message : "Terjadi kesalahan.",
      );
    });
  }, []);

  const handleLogout = async () => {
    setLoadingLogout(true);
    let logoutError: unknown;

    try {
      const session = await getAuthSession();
      if (session?.token) {
        await logoutApi(session.token);
      }
    } catch (error) {
      logoutError = error;
    }

    try {
      await clearAuthSession();
      router.replace("/login");
      if (logoutError) {
        Alert.alert(
          "Sesi Lokal Dihapus",
          logoutError instanceof Error
            ? `Tidak dapat menghapus token dari server: ${logoutError.message}`
            : "Tidak dapat menghapus token dari server.",
        );
      }
    } catch (error) {
      Alert.alert(
        "Gagal Keluar",
        error instanceof Error
          ? error.message
          : "Sesi lokal tidak dapat dihapus.",
      );
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <ScrollView
      style={tabStyles.screenContainer}
      contentContainerStyle={tabStyles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={tabStyles.card}>
        <View style={tabStyles.profileAvatar}>
          <Ionicons name="people" size={30} color="#2563EB" />
        </View>
        <Text style={tabStyles.sectionTitle}>
          {user?.name || "Profil Pengguna"}
        </Text>
        <Text style={tabStyles.sectionSubtitle}>
          Email: {user?.email || "-"}
          {"\n"}Nomor HP: {user?.no_hp || "Belum diisi"}
        </Text>
      </View>
      <TouchableOpacity
        style={tabStyles.logoutButton}
        activeOpacity={0.8}
        disabled={loadingLogout}
        onPress={handleLogout}
      >
        {loadingLogout ? (
          <ActivityIndicator color="#DC2626" />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text style={tabStyles.logoutButtonText}>Keluar dari Akun</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
