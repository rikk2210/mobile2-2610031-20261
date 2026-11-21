import { getAuthSession } from "@/services/authService";
import { authStyles } from "@/styles/authStyles";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

export default function Index() {
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let active = true;

    getAuthSession()
      .then((session) => {
        if (active) {
          setHasSession(Boolean(session?.token));
        }
      })
      .catch((error: unknown) => {
        Alert.alert(
          "Gagal Memeriksa Sesi",
          error instanceof Error ? error.message : "Terjadi kesalahan.",
        );
      })
      .finally(() => {
        if (active) {
          setChecking(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (checking) {
    return (
      <View style={authStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return <Redirect href={hasSession ? "/home" : "/login"} />;
}
