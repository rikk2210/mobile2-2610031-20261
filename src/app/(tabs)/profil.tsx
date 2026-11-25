import { getStorageImageUrl } from "@/config/api";
import {
  clearAuthSession,
  fetchProfileApi,
  getAuthSession,
  logoutApi,
  updatePasswordApi,
  updateProfileApi,
  updateStoredUser,
  uploadProfilePhotoApi,
  UserData,
} from "@/services/authService";
import { tabStyles } from "@/styles/tabStyles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export default function ProfilScreen() {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<"profil" | "password">("profil");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const fillProfileForm = (profile: UserData) => {
    setUser(profile);
    setName(profile.name || "");
    setEmail(profile.email || "");
    setNoHp(profile.no_hp || "");
  };

  useFocusEffect(
    useCallback(() => {
      let active = true;

      getAuthSession()
        .then(async (session) => {
          if (!session || !active) return;
          fillProfileForm(session.user);

          try {
            const fresh = await fetchProfileApi(session.token);
            if (active && fresh.user) {
              fillProfileForm(fresh.user);
              await updateStoredUser(fresh.user);
            }
          } catch (error) {
            if (active) {
              Alert.alert(
                "Sinkronisasi Profil Gagal",
                error instanceof Error
                  ? `Data tersimpan di perangkat tetap ditampilkan. ${error.message}`
                  : "Data tersimpan di perangkat tetap ditampilkan.",
              );
            }
          }
        })
        .catch((error: unknown) => {
          if (active) {
            Alert.alert(
              "Gagal Memuat Profil",
              error instanceof Error ? error.message : "Terjadi kesalahan.",
            );
          }
        });

      return () => {
        active = false;
      };
    }, []),
  );

  const handlePickPhoto = async (source: "camera" | "gallery") => {
    try {
      if (source === "camera") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            "Izin Kamera Ditolak",
            "Aktifkan izin kamera pada pengaturan HP agar dapat mengambil foto.",
          );
          return;
        }
      } else {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            "Izin Galeri Ditolak",
            "Aktifkan izin galeri pada pengaturan HP untuk memilih foto.",
          );
          return;
        }
      }

      const pickerOptions: ImagePicker.ImagePickerOptions = {
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      };
      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync(pickerOptions)
          : await ImagePicker.launchImageLibraryAsync(pickerOptions);

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > MAX_PHOTO_BYTES) {
        Alert.alert(
          "Ukuran Foto Terlalu Besar",
          "Ukuran maksimal foto yang diperbolehkan adalah 5 MB.",
        );
        return;
      }

      const session = await getAuthSession();
      if (!session?.token) {
        Alert.alert("Sesi Habis", "Silakan login kembali.");
        router.replace("/login");
        return;
      }

      setUploadingPhoto(true);
      const response = await uploadProfilePhotoApi(session.token, {
        uri: asset.uri,
        fileName: asset.fileName,
        mimeType: asset.mimeType,
      });

      fillProfileForm(response.user);
      await updateStoredUser(response.user);
      Alert.alert(
        "Berhasil",
        response.message || "Foto profil berhasil diperbarui.",
      );
    } catch (error) {
      Alert.alert(
        "Upload Foto Gagal",
        error instanceof Error ? error.message : "Gagal mengunggah foto profil.",
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim() || !noHp.trim()) {
      Alert.alert(
        "Input Belum Lengkap",
        "Nama, email, dan nomor HP wajib diisi.",
      );
      return;
    }

    setSavingProfile(true);
    try {
      const session = await getAuthSession();
      if (!session?.token) {
        router.replace("/login");
        return;
      }

      const response = await updateProfileApi(session.token, {
        name: name.trim(),
        email: email.trim(),
        no_hp: noHp.trim(),
      });

      fillProfileForm(response.user);
      await updateStoredUser(response.user);
      Alert.alert(
        "Berhasil",
        response.message || "Profil berhasil diperbarui.",
      );
    } catch (error) {
      Alert.alert(
        "Update Profil Gagal",
        error instanceof Error
          ? error.message
          : "Gagal memperbarui data profil.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(
        "Input Belum Lengkap",
        "Semua kolom kata sandi wajib diisi.",
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Kata Sandi Lemah",
        "Kata sandi baru minimal terdiri dari 6 karakter.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Konfirmasi Tidak Cocok",
        "Konfirmasi kata sandi baru tidak sama.",
      );
      return;
    }

    setSavingPassword(true);
    try {
      const session = await getAuthSession();
      if (!session?.token) {
        router.replace("/login");
        return;
      }

      const response = await updatePasswordApi(session.token, {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Berhasil", response.message);
    } catch (error) {
      Alert.alert(
        "Ganti Kata Sandi Gagal",
        error instanceof Error
          ? error.message
          : "Gagal memperbarui kata sandi.",
      );
    } finally {
      setSavingPassword(false);
    }
  };

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

  const photoUrl = getStorageImageUrl(user?.foto);

  return (
    <KeyboardAvoidingView
      style={tabStyles.screenContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={tabStyles.screenContainer}
        contentContainerStyle={tabStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={tabStyles.profileHeaderCard}>
          <View style={tabStyles.profileAvatar}>
            {photoUrl ? (
              <Image
                source={{ uri: photoUrl }}
                style={tabStyles.profileAvatarImage}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <Ionicons name="person" size={40} color="#2563EB" />
            )}
            {uploadingPhoto && (
              <View style={tabStyles.avatarOverlayLoading}>
                <ActivityIndicator color="#FFFFFF" />
              </View>
            )}
          </View>

          <Text style={tabStyles.sectionTitle}>
            {user?.name || "Profil Pengguna"}
          </Text>
          <Text style={tabStyles.sectionSubtitle}>{user?.email || "-"}</Text>

          <View style={tabStyles.photoActionRow}>
            <TouchableOpacity
              style={tabStyles.photoActionButton}
              activeOpacity={0.8}
              disabled={uploadingPhoto}
              onPress={() => handlePickPhoto("camera")}
            >
              <Ionicons name="camera-outline" size={18} color="#2563EB" />
              <Text style={tabStyles.photoActionButtonText}>Kamera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tabStyles.photoActionButton}
              activeOpacity={0.8}
              disabled={uploadingPhoto}
              onPress={() => handlePickPhoto("gallery")}
            >
              <Ionicons name="images-outline" size={18} color="#2563EB" />
              <Text style={tabStyles.photoActionButtonText}>Galeri</Text>
            </TouchableOpacity>
          </View>

          <Text style={tabStyles.photoHintText}>
            JPG/PNG/WebP | Maks 5 MB | Otomatis dikonversi ke WebP ringan
          </Text>
        </View>

        <View style={tabStyles.segmentContainer}>
          <TouchableOpacity
            style={[
              tabStyles.segmentButton,
              activeTab === "profil" && tabStyles.segmentButtonActive,
            ]}
            onPress={() => setActiveTab("profil")}
          >
            <Ionicons
              name="person-circle-outline"
              size={18}
              color={activeTab === "profil" ? "#2563EB" : "#64748B"}
            />
            <Text
              style={[
                tabStyles.segmentText,
                activeTab === "profil" && tabStyles.segmentTextActive,
              ]}
            >
              Data Profil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tabStyles.segmentButton,
              activeTab === "password" && tabStyles.segmentButtonActive,
            ]}
            onPress={() => setActiveTab("password")}
          >
            <Ionicons
              name="key-outline"
              size={18}
              color={activeTab === "password" ? "#2563EB" : "#64748B"}
            />
            <Text
              style={[
                tabStyles.segmentText,
                activeTab === "password" && tabStyles.segmentTextActive,
              ]}
            >
              Ganti Sandi
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "profil" ? (
          <View style={tabStyles.card}>
            <View style={tabStyles.formGroup}>
              <Text style={tabStyles.formLabel}>Nama Lengkap</Text>
              <View style={tabStyles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#64748B"
                  style={tabStyles.inputIcon}
                />
                <TextInput
                  style={tabStyles.textInput}
                  placeholder="Nama lengkap Anda"
                  placeholderTextColor="#94A3B8"
                  editable={!savingProfile}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={tabStyles.formGroup}>
              <Text style={tabStyles.formLabel}>Alamat Email</Text>
              <View style={tabStyles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color="#64748B"
                  style={tabStyles.inputIcon}
                />
                <TextInput
                  style={tabStyles.textInput}
                  placeholder="nama@kampus.ac.id"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!savingProfile}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={tabStyles.formGroup}>
              <Text style={tabStyles.formLabel}>Nomor HP / WhatsApp</Text>
              <View style={tabStyles.inputWrapper}>
                <Ionicons
                  name="call-outline"
                  size={18}
                  color="#64748B"
                  style={tabStyles.inputIcon}
                />
                <TextInput
                  style={tabStyles.textInput}
                  placeholder="081234567890"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  editable={!savingProfile}
                  value={noHp}
                  onChangeText={setNoHp}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                tabStyles.saveButton,
                savingProfile && tabStyles.saveButtonDisabled,
              ]}
              activeOpacity={0.85}
              disabled={savingProfile}
              onPress={handleSaveProfile}
            >
              {savingProfile ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={18} color="#FFFFFF" />
                  <Text style={tabStyles.saveButtonText}>
                    Simpan Perubahan Profil
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={tabStyles.card}>
            <View style={tabStyles.formGroup}>
              <Text style={tabStyles.formLabel}>Kata Sandi Saat Ini</Text>
              <View style={tabStyles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#64748B"
                  style={tabStyles.inputIcon}
                />
                <TextInput
                  style={tabStyles.textInput}
                  placeholder="Masukkan kata sandi lama"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showCurrent}
                  autoCapitalize="none"
                  editable={!savingPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <TouchableOpacity
                  style={tabStyles.eyeToggle}
                  onPress={() => setShowCurrent(!showCurrent)}
                >
                  <Ionicons
                    name={showCurrent ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={tabStyles.formGroup}>
              <Text style={tabStyles.formLabel}>Kata Sandi Baru</Text>
              <View style={tabStyles.inputWrapper}>
                <Ionicons
                  name="key-outline"
                  size={18}
                  color="#64748B"
                  style={tabStyles.inputIcon}
                />
                <TextInput
                  style={tabStyles.textInput}
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showNew}
                  autoCapitalize="none"
                  editable={!savingPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  style={tabStyles.eyeToggle}
                  onPress={() => setShowNew(!showNew)}
                >
                  <Ionicons
                    name={showNew ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={tabStyles.formGroup}>
              <Text style={tabStyles.formLabel}>
                Konfirmasi Kata Sandi Baru
              </Text>
              <View style={tabStyles.inputWrapper}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#64748B"
                  style={tabStyles.inputIcon}
                />
                <TextInput
                  style={tabStyles.textInput}
                  placeholder="Ulangi kata sandi baru"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  editable={!savingPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={tabStyles.eyeToggle}
                  onPress={() => setShowConfirm(!showConfirm)}
                >
                  <Ionicons
                    name={showConfirm ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                tabStyles.saveButton,
                savingPassword && tabStyles.saveButtonDisabled,
              ]}
              activeOpacity={0.85}
              disabled={savingPassword}
              onPress={handleSavePassword}
            >
              {savingPassword ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color="#FFFFFF"
                  />
                  <Text style={tabStyles.saveButtonText}>
                    Perbarui Kata Sandi
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={tabStyles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
          disabled={loadingLogout}
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
    </KeyboardAvoidingView>
  );
}
