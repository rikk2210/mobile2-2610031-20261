import { API_ENDPOINTS } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { File } from "expo-file-system";
import { Platform } from "react-native";

const AUTH_TOKEN_KEY = "@novinaldiapp_token";
const AUTH_USER_KEY = "@novinaldiapp_user";

export interface UserData {
  id: number;
  name: string;
  email: string;
  no_hp: string | null;
  foto: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserData;
}

export interface AuthSession {
  token: string;
  user: UserData;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  no_hp: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  no_hp: string;
}

export interface UpdatePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ProfileResponse {
  success: boolean;
  message?: string;
  user: UserData;
  foto_url?: string;
}

export interface BasicMessageResponse {
  success: boolean;
  message: string;
}

export interface PhotoUploadAsset {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (isRecord(data) && isRecord(data.errors)) {
      const firstError = Object.values(data.errors)[0];
      if (Array.isArray(firstError) && typeof firstError[0] === "string") {
        throw new Error(firstError[0]);
      }
    }

    const message =
      isRecord(data) && typeof data.message === "string"
        ? data.message
        : `Permintaan gagal dengan status HTTP ${response.status}.`;

    throw new Error(message);
  }

  return data as T;
}

async function postJson<T>(
  endpoint: string | undefined,
  payload: unknown,
  token?: string,
): Promise<T> {
  if (!endpoint) {
    throw new Error("URL API belum dikonfigurasi.");
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Tidak dapat terhubung ke server Laravel. Pastikan server aktif dan alamat API benar.",
      );
    }
    throw error;
  }

  return handleApiResponse<T>(response);
}

export function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  return postJson<AuthResponse>(API_ENDPOINTS.LOGIN, payload);
}

export function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  return postJson<AuthResponse>(API_ENDPOINTS.REGISTER, payload);
}

export async function logoutApi(token: string): Promise<void> {
  await postJson<unknown>(API_ENDPOINTS.LOGOUT, undefined, token);
}

export async function saveAuthSession(
  user: UserData,
  token: string,
): Promise<void> {
  await AsyncStorage.multiSet([
    [AUTH_TOKEN_KEY, token],
    [AUTH_USER_KEY, JSON.stringify(user)],
  ]);
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const values = await AsyncStorage.multiGet([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
  const token = values[0]?.[1];
  const userJson = values[1]?.[1];

  if (!token || !userJson) {
    return null;
  }

  try {
    return { token, user: JSON.parse(userJson) as UserData };
  } catch (error) {
    if (error instanceof SyntaxError) {
      await clearAuthSession();
      return null;
    }
    throw error;
  }
}

export async function clearAuthSession(): Promise<void> {
  await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
}

export async function fetchProfileApi(
  token: string,
): Promise<ProfileResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.PROFILE, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await handleApiResponse<ProfileResponse>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Tidak dapat terhubung ke server Laravel. Periksa koneksi Wi-Fi Anda.",
      );
    }
    throw error;
  }
}

export async function updateProfileApi(
  token: string,
  payload: UpdateProfilePayload,
): Promise<ProfileResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await handleApiResponse<ProfileResponse>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Gagal menghubungi server saat menyimpan profil. Cek koneksi Wi-Fi.",
      );
    }
    throw error;
  }
}

export async function updatePasswordApi(
  token: string,
  payload: UpdatePasswordPayload,
): Promise<BasicMessageResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.UPDATE_PASSWORD, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await handleApiResponse<BasicMessageResponse>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Gagal menghubungi server saat mengganti kata sandi. Cek koneksi Wi-Fi.",
      );
    }
    throw error;
  }
}

export async function uploadProfilePhotoApi(
  token: string,
  asset: PhotoUploadAsset,
): Promise<ProfileResponse> {
  try {
    const formData = new FormData();
    const fallbackExt =
      asset.mimeType === "image/png"
        ? "png"
        : asset.mimeType === "image/webp"
          ? "webp"
          : "jpg";
    const fileName = asset.fileName || `profile_${Date.now()}.${fallbackExt}`;

    if (Platform.OS === "web") {
      const blobResponse = await fetch(asset.uri);
      if (!blobResponse.ok) {
        throw new Error("Gagal membaca foto yang dipilih.");
      }
      const blob = await blobResponse.blob();
      formData.append("foto", blob, fileName);
    } else {
      const file = new File(asset.uri);
      formData.append("foto", file);
    }

    const response = await fetch(API_ENDPOINTS.UPDATE_PHOTO, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return await handleApiResponse<ProfileResponse>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Gagal mengunggah foto ke server. Pastikan server menyala (--host=0.0.0.0).",
      );
    }
    throw error;
  }
}

export async function updateStoredUser(user: UserData): Promise<void> {
  await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}
